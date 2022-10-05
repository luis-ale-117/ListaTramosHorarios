from flask import Blueprint, render_template, request, jsonify, flash
import datetime as dt

time_zero = dt.datetime.strptime('00:00:00', '%H:%M:%S')
hour = dt.datetime.strptime('08:00:00', '%H:%M:%S')
end_hour = dt.datetime.strptime('20:00:00', '%H:%M:%S')
interval = dt.datetime.strptime('00:30:00', '%H:%M:%S')
hour_format = "%I:%M %p"
initial_motorcycles = 8

motorcycles_schedule = dict()

while(hour!=end_hour):
    hour = hour - time_zero + interval
    motorcycles_schedule[hour.strftime(hour_format)] = initial_motorcycles

views = Blueprint('views',__name__)

@views.route('/')
def home():
    return render_template('home.html', motorcycles_schedule = motorcycles_schedule)

@views.route('/request-motorcycle', methods=['POST'])
def request_motorcycle():
    motorcycle_request = request.get_json()
    action  = motorcycle_request['action']
    req_hour = motorcycle_request['hour']
    if req_hour not in motorcycles_schedule.keys():
        response = {'stauts':'Invalid hour'}
    elif action=='get_motorcycle':
        if motorcycles_schedule[req_hour] == 0:
            response = {'status':'Unavailable'}
        else:
            motorcycles_schedule[req_hour] = motorcycles_schedule[req_hour]-1
            response = {'status':'ok'}
    elif action=='return_motorcycle':
        if motorcycles_schedule[req_hour] == 8:
            response = {'status':'Full'}
        else:
            motorcycles_schedule[req_hour] = motorcycles_schedule[req_hour]+1
            response = {'status':'ok'}
    return jsonify(response)

@views.route('/update-motorcycle', methods=['GET'])
def update_motorcycle():
    response = {'status':'ok'}
    response['motorcycles_update'] = [m for m in motorcycles_schedule.values()]
    return jsonify(response)