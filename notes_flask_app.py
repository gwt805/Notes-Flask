import json
from loguru import logger
from wxpusher import WxPusher
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


def sendmsg(flag):
    token = "AT_nkD5XKtSCOqTCDUYfY6KAQJiPrY5VPFD"
    uid = "UID_XP4adcbMnVNvV9Zkb413jFDQAP8l"
    content = f"用户: {request.environ['REMOTE_ADDR']} 访问了您的应用 [Notes-Flask] 的 {flag} 页面"
    try:
        res = WxPusher.send_message(content=content, uids=[uid], token=token)
        logger.info(res)
    except:
        logger.error("发消息出错了?")


@app.route('/', methods=['GET'])
def jianli():
    sendmsg("简历")
    return render_template("resume.html")


@app.route('/login', methods=['GET'])
def login():
    sendmsg("登录")
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
    sendmsg("笔记")
    return render_template("index.html")


# app.run(host="0.0.0.0", port=80, debug=True)  # 本地调试打开
