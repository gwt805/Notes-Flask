import json
from flask import Flask, request, Response, render_template

# 初始化web应用
app = Flask(__name__, instance_relative_config=True)
app.config['DEBUG'] = False


def make_succ_empty_response():
    data = json.dumps({'code': 0, 'data': {}})
    return Response(data, mimetype='application/json')


def make_succ_response(data):
    data = json.dumps({'code': 0, 'data': data})
    return Response(data, mimetype='application/json')


def make_err_response(err_msg):
    data = json.dumps({'code': -1, 'errorMsg': err_msg})
    return Response(data, mimetype='application/json')


@app.route('/', methods=['GET'])
def jianli():
    return render_template("resume.html")


@app.route('/login', methods=['GET'])
def login():
    return render_template("login.html")


@app.route('/login', methods=['POST'])
def logins():
    params = request.get_json()
    user = params['user']
    pwd = params['pwd']
    if user == pwd == "admin":
        return make_succ_response("successful")
    else:
        return make_succ_response("error")


@app.route('/notes')
def notes():
    return render_template("index.html")


# app.run(host="0.0.0.0", port=80)  # 本地调试打开
