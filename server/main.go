package main

import (
	"strconv"
	"sort"
	"context"
	"fmt"
	"log"
	"time"
	"os"
	"io"
	"strings"
	"path/filepath"
	"net/http"
	"encoding/json"
	"github.com/google/uuid"
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
	admin_user = "admin"
	admin_pass = "password"
	server_port = "3007"
	appt_table_name = "appts"
)

var (
	key = []byte("secret-key")
	store = sessions.NewCookieStore(key)
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

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Data = interface{}

// DB is a global variable to hold db connection
var DB *sql.DB


// Generates a response struct to be returned by an endpoint
func GenerateResponse(s bool, m string, d Data) Response {
	return Response{s, m, d}
}

// Verifies that a byte array can marshal as json
func (r *Response) MustMarshal() []byte {
	j, err := json.Marshal(r)

	if err != nil {
		log.Printf(err.Error())
	}

	return j
}

// Check if an image extension is in the whitelist
func CheckValidFile(ext string) bool {
	switch ext {
	case ".jpg", ".jpeg", ".png", ".gif":
		return true
	}
	return false
}

// All purpose error checking
func ErrorCheck(err error) {
    if err != nil {
        log.Printf(err.Error())
    }
}

// Pings the DB to make sure connection is working
func PingDB(db *sql.DB) {
    err := db.Ping()
    ErrorCheck(err)
}

// Format string for database connection
func dsn(dbName string) string {  
    return fmt.Sprintf("%s:%s@tcp(%s)/%s", db_user, db_pass, db_hostname, dbName)
}

// Generates the appointments table if it does not already exist
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

// Set up our routes
func handleRequests() {
	// create new mux router
	router := mux.NewRouter().StrictSlash(true)

	// set up endpoints in router
	router.HandleFunc("/api/appointment", createNewAppointment).Methods("POST")
	router.HandleFunc("/api/appointments", returnAllAppointments)
	router.HandleFunc("/api/appointment/{id}", returnSingleAppointment)
	router.HandleFunc("/api/license", uploadLicense)

	// set up server to serve images from the /images/{file} route
  	router.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))

	http.Handle("/", router)

	log.Fatal(http.ListenAndServe(":"+server_port, nil))
}

func main() {
	log.Printf("Patient Registration Server Starting...")

	db, err := sql.Open("mysql", dsn(""))
    if err != nil {
        log.Printf("Error %s when connecting to MySQL\n", err)
        return
    }
    PingDB(db)
    //defer db.Close()

    log.Printf("MySQL connection established...")

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

    // created the database so close the initial connection
    db.Close()

    // open up the connection to the database we just made
	db, err = sql.Open("mysql", dsn(db_name))
	ErrorCheck(err)
	PingDB(db)

	log.Printf("Database connection established...")

	// close when the main function has finished execution
	defer db.Close()

	log.Printf("Creating %s table if it does not already exist...", appt_table_name)
	err = createAppointmentTable(db)
	if err != nil {
        log.Printf("Create %s table failed with error %s", appt_table_name, err)
        return
    }

    gs := NewManager("memory","prsessionid",3600)

    // Assign globals now that startup has finished
	DB = db
	GS = gs

	handleRequests()
}

func logInAdmin(w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: logInAdmin")

	session, _ := store.Get(r, "pr-token")

    // read from the body of the POST request
	reqBody, _ := ioutil.ReadAll(r.Body)

	// unmarshal into Login struct
	var login Login
	var err = json.Unmarshal(reqBody, &appt)

	if err != nil {
        fmt.Println("unmarshalling error ", err)
        return
    }

    // allow CORS
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

    if(Login.username == admin_user && Login.password == admin_pass) {
    	// Set user as authenticated
	    session.Values["authenticated"] = true
	    session.Save(r, w)

        msg := "Admin logged in"
	    log.Println(msg);
	    res := GenerateResponse(true, msg, nil)
    } else {
    	msg := "Admin log in attempt failed"
	    log.Println(msg);
	    res := GenerateResponse(false, msg, nil)
    }

    json.NewEncoder(w).Encode(res)
}

func logOutAdmin(w http.ResponseWriter, r *http.Request) {
	log.Println("Endpoint Hit: logOutAdmin")

    session, _ := store.Get(r, "pr-token")

    // Revoke users authentication
    session.Values["authenticated"] = false
    session.Save(r, w)
}

func returnAllAppointments(w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: returnAllAppointments")

	session, _ := store.Get(r, "pr-token")

    // Check if user is authenticated
    if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

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

    sort.SliceStable(appts, func(i, j int) bool {
	    return appts[i].ApptTime > appts[j].ApptTime
	})

    msg := "Returned list of all appointments"
    log.Println(msg);
    res := GenerateResponse(true, msg, appts)

    // allow CORS
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(res)
}

func returnSingleAppointment(w http.ResponseWriter, r *http.Request){
	log.Println("Endpoint Hit: returnSingleAppointment")

	session, _ := store.Get(r, "pr-token")

    // Check if user is authenticated
    if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
        http.Error(w, "Forbidden", http.StatusForbidden)
        return
    }

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

    // allow CORS
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

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

	// allow CORS
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(res)
}

func uploadLicense(w http.ResponseWriter, r *http.Request) {
	log.Println("Endpoint Hit: uploadImage")

	// allow CORS
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Origin, Authorization")

	// max size 10MB
	r.ParseMultipartForm(10 << 20)

	file, handler, err := r.FormFile("licenseImage")
	if err != nil {
		fmt.Println("Error Retrieving the File")
        fmt.Println(err)
        return
	}

	defer file.Close()

	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
    fmt.Printf("File Size: %+v\n", handler.Size)
    fmt.Printf("MIME Header: %+v\n", handler.Header)

    fileExt := strings.ToLower(filepath.Ext(handler.Filename));

    if !CheckValidFile(fileExt) {
    	msg := "Invalid file type: "+fileExt
    	log.Println(msg);
    	res := GenerateResponse(false, msg, nil)

    	json.NewEncoder(w).Encode(res)
        return
    }

    // Generate a new filename that is unique.
    // so use uuid and remove hyphens
    // and concat with the correct file extension for uploaded file
    uploadedName := strings.Replace(uuid.NewString(), "-", "", -1) + fileExt

    // Create file
	dst, err := os.Create("images/"+uploadedName)
	defer dst.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy the uploaded file to the created file on the filesystem
	if _, err := io.Copy(dst, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

    msg := "Successfully Uploaded File "
    log.Println(msg);
    res := GenerateResponse(true, msg, uploadedName)

	json.NewEncoder(w).Encode(res)
}
