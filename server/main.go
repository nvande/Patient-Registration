package main

import (
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

type Appt struct {
	Id   int `json:"id,omitempty"`
	Name string `json:"name"`
	Dob  string `json:"dob"`
}

// DB is a global variable to hold db connection
var DB *sql.DB

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
	query := `CREATE TABLE IF NOT EXISTS `+appt_table_name+`(id int primary key auto_increment, name varchar(255), 
        dob date, created_at datetime default CURRENT_TIMESTAMP)`

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
	fmt.Println("Endpoint Hit: returnAllAppointments")

	// Execute the query
    results, err := DB.Query("SELECT id, name, dob FROM ?", appt_table_name)
    ErrorCheck(err)

	var appts []Appt

	for results.Next() {
        var appt Appt
        // for each row, scan the result into our appt composite object
        err = results.Scan(&appt.Id, &appt.Name, &appt.Dob)
        if err != nil {
            log.Print("results err: "+err.Error())
        }
        // slap it onto the end of our appointments
		appts = append(appts, appt)
    }

	json.NewEncoder(w).Encode(appts)
}

func returnSingleAppointment(w http.ResponseWriter, r *http.Request){
	fmt.Println("Endpoint Hit: returnSingleAppointment")

	vars := mux.Vars(r)
	key := vars["id"]

	var appt Appt

	// Execute the query
    err := DB.QueryRow("SELECT id, name, dob FROM ? WHERE id = ?", appt_table_name, key).Scan(&appt.Id, &appt.Name, &appt.Dob)
    ErrorCheck(err)

	json.NewEncoder(w).Encode(appt)
}

func createNewAppointment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint Hit: createNewAppointment")

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
	stmt, err := DB.Prepare("INSERT INTO ?(name, dob) values (?, ?)")
	ErrorCheck(err)

	//execute
	res, err := stmt.Exec(appt_table_name, appt.Name, appt.Dob)
	ErrorCheck(err)

	id, err := res.LastInsertId()
    ErrorCheck(err)
 
    appt.Id = int(id)

	json.NewEncoder(w).Encode(appt)
	
}