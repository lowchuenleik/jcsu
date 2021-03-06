import requests
import csv
import json

'''
General structure of this script will be:

1) Parse the student data in whatever form it may come in, and make it into a json
2) We will post the requests to our local server OR the hosted one on heroku
    - Doesn't matter hugely as both are linked to the same DB anyways.
3) Post data with relevant attributes, and ensure they persist in the DB.

'''

test_student_data = {
    "username": "cll58",
    "id": 1,

}

test_subject_data = {
    "name": "Computer Science",
    "description": "Study of Computers",
    "ranking": 0,
    "students": ['5d77a31f1c9d4400009df250']
}

test_accom_data = {
    "name": "Chapel Court 10",
    "description": "Internal",
    "capacity": 10,
    "residents": ['5d77a31f1c9d4400009df250']
}

get_accoms = requests.get('http://localhost:5000/accommodation')
accoms = json.loads(get_accoms.content)['data']

target_id = accoms[0]['_id']

r = requests.post('http://localhost:5000/accommodation/' + target_id, data={"capacity" : 100})

#
# r = requests.post('http://localhost:5000/student', data=test_student_data)
# r = requests.post('http://localhost:5000/accommodation', data=test_accom_data);