from flask import Flask
app = Flask(__name__, static_folder='static')

@app.route("/")
def home():
    return "<h1>HOME</h1>"

if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', port=80)