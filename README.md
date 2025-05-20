# Hospital Queue Management System
**DES424** |  Cloud-based Application Development  
Digital Engineering Department, Semester 1, Academic Year 2024  
Sirindhorn International Institute of Technology (SIIT), Thammasat University

## Project Members
- Phanutchanat Nongya (6422770303) (Role: Design, Frontend)
- Apisara Rattana (6422780187) (Role: Cloud, Backend & Database)
- Voranuch Sab-Udommark (6422781300) (Role: QA)
- Chutikarn Jongvijitkun (6422782092) (Role: Cloud, Frontend)
- Tiya Donlakorn (64228001180) (Role: Backend & Database)

## Project Description
### Overview
This project proposes a cloud-based queue management system using AWS to streamline the process for ensuring seamless transitions between various stages of care and improving patient flow management.

### Cloud Services Usage
The Hospital Queue Management System uses AWS Amplify for hosting the frontend, Amazon API Gateway for managing API requests, AWS Lambda for backend logic, and Amazon DynamoDB for storing hospital queue data and patient's data.
![Send notification (6)](https://github.com/user-attachments/assets/576fc3b1-1fee-4bb7-81a1-4f73ca7645e8)

### Software Testing and QA
Using Robot Framework, Selenium Library, and Operating System Library to test the web application. 

## Project Features
### Users
- Users can create a queue.
- Users can view queue information.

### Admin
- Admin can assign department.
- Admin can assign room number.
- Admin can update queue information

## Cloud Resources
- AWS Amplify: Hosts the React front-end, connects with other AWS services like AppSync, Lambda. Allows patients and hospital staff to interact with the system via a web interface.
- Amazon API Gateway: Serves as the interface to connect the Lambda functions with the frontend, enabling communication between the client and backend.
- AWS Lambda: Functions in the system act as the backend, handling logic and processing requests.
- Amazon DynamoDB: Stores patient queue information and statuses, ensuring fast and scalable data retrieval.

### Prerequisites
- Node.js v16 or higher
- AWS account with subscription and these resources:
    - AWS Amplify
    - Amazon API Gateway
    - Amazon DynamoDB

# Frontend will be running on port 3000
npm run dev
Open the web application 
for user
http://localhost:3000/user/register-queue

for admin
http://localhost:3000/admin/admin-dashboard

# Check if robot framework and selenium library are installed
robot --version

# If not, install robot framework and selenium library
pip install robotframework
pip install robotframework-seleniumlibrary
pip install robotframework-operatingsystem

# Check if chromedriver is installed
chromedriver --version

# If not, install chromedriver

bash
# Run the test scripts
## Some scripts require some varibles changes in the test scripts, such as new username and email and ABSOLUTE path of the sample video file. ##
cd ../testing

# Test patient page
robot test.robot

# Test existing patient with an appointment
robot testexist.robot

# Test existing patient without an appointmaent
robot testexistno.robot

# Test patient with exising queue
robot testdupli.robot

# Test admin
robot testdupli.robot

## Project Management
We used JIRA to manage our project. The link to the JIRA board can be found [here](hhttps://group5cloud-based.atlassian.net/jira/software/projects/CBP/boards/2/timeline).  

