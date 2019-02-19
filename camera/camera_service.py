from flask import Flask

service = Flask(__name__)

# Creating basic route
@service.route("/", methods=["GET"])
def hello():
    return "Hello World!"

# Being flask app
if __name__ == "__main__":
    service.run(port=5000, debug=False)
