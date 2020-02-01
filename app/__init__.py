#from flask import Flask
from flask import Flask, session, redirect, url_for, request, render_template

app = Flask(__name__)
app.secret_key = ".."

from app import routes
