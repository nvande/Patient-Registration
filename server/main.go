package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"github.com/gorilla/mux"
	"io/ioutil"
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
)

type Appt struct {
	Id   string `json:"Id"`
	Name string `json:"Name"`
	Dob  string `json:"dob"`
}

var Appts []Appt

var db_user = "root"
var db_pass = "password"

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Homepage Endpoint Hit")
}

func handleRequests() {
	// create new mux router
	router := mux.NewRouter().StrictSlash(true)

	//set up endpoints in router
	router.HandleFunc("/api/appointment", createNewAppointment).Methods("POST")
	router.HandleFunc("/api/appointments", returnAllAppointments)
	router.HandleFunc("/api/appointment/{id}", returnSingleAppointment)

	http.Handle("/", router)

	log.Fatal(http.ListenAndServe(":3007", nil))
}

func main() {
	fmt.Println("Patient Registration Server Starting...")

	db, err := sql.Open("mysql", db_user+":"+db_pass+"@tcp(127.0.0.1:3306)/prdb")

	if err != nil {
		panic(err.Error())
	}

	Appts = []Appt{
		Appt{ Id: "1", Name: "Joe J", Dob: "1/1/1",},
		Appt{ Id: "2", Name: "Jane B", Dob: "3/3/3",},
	}

	handleRequests()

	// close when the main function has finished execution
	defer db.Close()
}

func returnAllAppointments(w http.ResponseWriter, r *http.Request){
	fmt.Println("Endpoint Hit: returnAllAppointments")
	json.NewEncoder(w).Encode(Appts)
}

func returnSingleAppointment(w http.ResponseWriter, r *http.Request){
	vars := mux.Vars(r)
	key := vars["id"]

	// Loop over all of our appointments
    // if the appt.Id equals the key we pass in
    // return the appt encoded as JSON
    for _, appt := range Appts {
        if appt.Id == key {
            json.NewEncoder(w).Encode(appt)
        }
    }
}

func createNewAppointment(w http.ResponseWriter, r *http.Request) {
	// read from the body of the POST request
	reqBody, _ := ioutil.ReadAll(r.Body)

	// unmarshal into Appt struct
	var appt Appt
	var err = json.Unmarshal(reqBody, &appt)

	if err != nil {
        fmt.Println("unmarshalling error ", err)
        return
    }

	// slap it onto the end of our appointments
	Appts = append(Appts, appt)

	json.NewEncoder(w).Encode(appt)
	
}