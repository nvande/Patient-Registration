package main

import (
	"strconv"
	"context"
	"fmt"
	"log"
	"time"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

const (
	db_user = "root"
	db_pass = "password"
	db_hostname = "127.0.0.1:3306"
	db_name = "prdb"
	server_port = "3007"
	appt_table_name = "appts"
)

type Address struct {
	Address1 string `json:"address1"`
	Address2 string `json:"address2"`
	City     string `json:"city"`
	Country  string `json:"country"`
	Region   string `json:"region"`
	Postal   string `json:"postal"`
}

type Patient struct {
	Firstname string  `json:"firstname"`
	Middle    string  `json:"middle"`
	Lastname  string  `json:"lastname"`
	Dob       string  `json:"dob"`
	Phone     string  `json:"phone"`
	Email     string  `json:"email"`
	Address   Address `json:"address"`
	Photo     string  `json:"photo"`
}

type Appt struct {
	Id        int64   `json:"id,omitempty"`
	Patient   Patient `json:"patient"`
	ApptTime  string  `json:"appt_time"`
	CreatedAt string  `json:"created_at"`
}

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    Data   `json:"data,omitempty"`
}

type Data = interface{}

// DB is a global variable to hold db connection
var DB *sql.DB

func GenerateResponse(s bool, m string, d Data) Response {
	return Response{s, m, d}
}

func (r *Response) MustMarshal() []byte {
	j, err := json.Marshal(r)

	if err != nil {
		log.Printf(err.Error())
	}

	return j
}

func ErrorCheck(err error) {
    if err != nil {
        log.Printf(err.Error())
    }
}

func PingDB(db *sql.DB) {
    err := db.Ping()
    ErrorCheck(err)
}

func dsn(dbName string) string {  
    return fmt.Sprintf("%s:%s@tcp(%s)/%s", db_user, db_pass, db_hostname, dbName)
}

func createAppointmentTable(db *sql.DB) error {
	query := `CREATE TABLE IF NOT EXISTS `+appt_table_name+`(
		id int primary key auto_increment,
		firstname varchar(255),
		middle varchar(1) NOT NULL DEFAULT '',
		lastname varchar(255), 
        dob date,
        phone varchar(30),
        email varchar(320),
        address1 varchar(255),
        address2 varchar(255) NOT NULL DEFAULT '',
        city varchar(255), 
        country varchar(255),
        region varchar(255),
        postal varchar(30),
        photo varchar(255),
        appt_time datetime, 
        created_at datetime default CURRENT_TIMESTAMP)`

   	ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
   	defer cancelfunc()
   	res, err := db.ExecContext(ctx, query)
   	if err != nil {
        log.Printf("Error %s when creating %s table", err, appt_table_name)
        return err
    }
   	rows, err := res.RowsAffected()
    if err != nil {
        log.Printf("Error %s when getting rows affected", err)
        return err
    }

    log.Printf("Rows affected when creating table: %d", rows)
    return nil
}

func handleRequests() {
	// create new mux router
	router := mux.NewRouter().StrictSlash(true)

	//set up endpoints in router
	router.HandleFunc("/api/appointment", createNewAppointment).Methods("POST")
	router.HandleFunc("/api/appointments", returnAllAppointments)
	router.HandleFunc("/api/appointment/{id}", returnSingleAppointment)

	http.Handle("/", router)

	log.Fatal(http.ListenAndServe(":"+server_port, nil))
}

func main() {
	log.Printf("Patient Registration Server Starting...")

	db, err := sql.Open("mysql", dsn(""))
    if err != nil {
        log.Printf("Error %s when connecting to DB\n", err)
        return
    }
    PingDB(db)
    //defer db.Close()

    log.Printf("Database connection established...")

	ctx, cancelfunc := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancelfunc()
    res, err := db.ExecContext(ctx, "CREATE DATABASE IF NOT EXISTS "+db_name)
    if err != nil {
        log.Printf("Error %s when creating DB\n", err)
        return
    }
    no, err := res.RowsAffected()
    if err != nil {
        log.Printf("Error %s when fetching rows", err)
    }
    log.Printf("%d rows affected\n", no)

    db.Close()

	db, err = sql.Open("mysql", dsn(db_name))
	ErrorCheck(err)
	PingDB(db)

	// close when the main function has finished execution
	defer db.Close()

	log.Printf("Creating %s table if it does not already exist...", appt_table_name)
	err = createAppointmentTable(db)
	if err != nil {
        log.Printf("Create %s table failed with error %s", appt_table_name, err)
        return
    }

	DB = db

	handleRequests()
}

func returnAllAppointments(w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: returnAllAppointments")

	// Execute the query
    results, err := DB.Query(`SELECT id,
    	firstname,
    	middle,
    	lastname,
    	dob,
    	phone,
    	email,
    	address1,
    	address2,
    	city,
    	country,
    	region,
    	postal,
    	photo,
    	appt_time,
    	created_at FROM `+appt_table_name)
    ErrorCheck(err)

	var appts []Appt

	for results.Next() {
        var appt Appt
        // for each row, scan the result into our appt composite object
        err = results.Scan(
        	&appt.Id,
        	&appt.Patient.Firstname,
        	&appt.Patient.Middle,
        	&appt.Patient.Lastname,
        	&appt.Patient.Dob,
        	&appt.Patient.Phone,
        	&appt.Patient.Email,
        	&appt.Patient.Address.Address1,
        	&appt.Patient.Address.Address2,
        	&appt.Patient.Address.City,
        	&appt.Patient.Address.Country,
        	&appt.Patient.Address.Region,
        	&appt.Patient.Address.Postal,
        	&appt.Patient.Photo,
        	&appt.ApptTime,
        	&appt.CreatedAt,
        )
        if err != nil {
            log.Printf("results err: %s", err.Error())
            res := GenerateResponse(false, "Error returning appointments", nil)
			json.NewEncoder(w).Encode(res)
			return
        }
        // slap it onto the end of our appointments
		appts = append(appts, appt)
    }

    msg := "Returned list of all appointments"
    log.Println(msg);
    res := GenerateResponse(true, msg, appts)

	json.NewEncoder(w).Encode(res)
}

func returnSingleAppointment(w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: returnSingleAppointment")

	vars := mux.Vars(r)
	key := vars["id"]

	var appt Appt

	// Execute the query
    err := DB.QueryRow(`SELECT id,
    	firstname,
    	middle,
    	lastname,
    	dob,
    	phone,
    	email,
    	address1,
    	address2,
    	city,
    	country,
    	region,
    	postal,
    	photo,
    	appt_time,
    	created_at FROM `+appt_table_name+" WHERE id = ?", key).Scan(
	    	&appt.Id,
	    	&appt.Patient.Firstname,
	    	&appt.Patient.Middle,
	    	&appt.Patient.Lastname,
	    	&appt.Patient.Dob,
	    	&appt.Patient.Phone,
	    	&appt.Patient.Email,
	    	&appt.Patient.Address.Address1,
	    	&appt.Patient.Address.Address2,
	    	&appt.Patient.Address.City,
	    	&appt.Patient.Address.Country,
	    	&appt.Patient.Address.Region,
	    	&appt.Patient.Address.Postal,
	    	&appt.Patient.Photo,
	    	&appt.ApptTime,
	    	&appt.CreatedAt,
    )
    if err != nil {
        log.Println(err)
        res := GenerateResponse(false, "Error returning appointment", nil)
			json.NewEncoder(w).Encode(res)
			return
        return
    }

    msg := "Returned single appointment with id "
    log.Println(msg+key);
    res := GenerateResponse(true, msg+key, appt)

	json.NewEncoder(w).Encode(res)
}

func createNewAppointment(w http.ResponseWriter, r *http.Request) {
	log.Println("Endpoint Hit: createNewAppointment")

	// read from the body of the POST request
	reqBody, _ := ioutil.ReadAll(r.Body)

	// unmarshal into Appt struct
	var appt Appt
	var err = json.Unmarshal(reqBody, &appt)

	if err != nil {
        fmt.Println("unmarshalling error ", err)
        return
    }

    // insert into db
	// prepare  
	stmt, err := DB.Prepare(`INSERT INTO `+appt_table_name+`(
		firstname,
		middle,
    	lastname,
    	dob,
    	phone,
    	email,
    	address1,
    	address2,
    	city,
    	country,
    	region,
    	postal,
    	photo,
    	appt_time
    ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
	ErrorCheck(err)

	//execute
	result, err := stmt.Exec(
    	appt.Patient.Firstname,
    	appt.Patient.Middle,
    	appt.Patient.Lastname,
    	appt.Patient.Dob,
    	appt.Patient.Phone,
    	appt.Patient.Email,
    	appt.Patient.Address.Address1,
    	appt.Patient.Address.Address2,
    	appt.Patient.Address.City,
    	appt.Patient.Address.Country,
    	appt.Patient.Address.Region,
    	appt.Patient.Address.Postal,
    	appt.Patient.Photo,
    	appt.ApptTime,
	)
	if err != nil {
		log.Println(err)
		res := GenerateResponse(false, "Error returning appointments", nil)
		json.NewEncoder(w).Encode(res)
		return
	}

	dt := time.Now()
	id, err := result.LastInsertId()
    ErrorCheck(err)
 
    appt.Id = id
    appt.CreatedAt = dt.Format("01-02-2006 15:04:05")

    strid := strconv.FormatInt(id, 10)
    msg := "Created new appointment with id "
    log.Println(msg+strid);
	res := GenerateResponse(true, msg+strid, appt)

	json.NewEncoder(w).Encode(res)
	
}