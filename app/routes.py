from app import app
from flask import Flask, session, redirect, url_for, request, render_template,  jsonify
import os
import subprocess


online = dict()

open_files = dict()

def dir_check(user, proj):
	if not os.path.isdir("data/{}/{}".format(user, proj)):
		os.system("mkdir data/{}/{}".format(user, proj))


def create_file(curr_name, path, content):
	path = "data/{}/{}".format(curr_name, filename)
	if (os.path.isfile(path)):
		return None
	with open(path, "w") as f:
		f.write(content)

def create_dir(user, proj, dirname):
	os.system("mkdir data/{}/{}/{}".format(user, proj, dirname))

def save_file(user, filename, project, content):
	dir_check(user, project)
	path = "data/{}/{}/{}".format(user, project, filename)
	with open(path, "w") as f:
		f.write(content)

def delete_file(user, project, filename):
	path = "data/{}/{}/{}".format(user, project, filename)
	if (os.path.isfile(path)):
		os.system("rm {}".format(path))

def run_file(path):
	proc = subprocess.Popen(["python3 {}".format(path)], stdout=subprocess.PIPE, shell=True)
	(out, err) = proc.communicate()
	ret = ""
	#print(out)
	if out != None:
		ret += out.decode()
	if err != None:
		print("Error")
		print(err)
		print("End Error")
		ret += err
	return ret.replace('\n', '<br>')

def merge(d1, d2):
        for key  in d2.keys():
                if key not in d1.keys():
                        d1[key] = d2[key]
        return d1

def get_files(path):
        #dir_check(user, proj)
        d = dict()
        #path = "data/{}/{}/".format(user, proj)
        d['dir'] = rec_files("data/" + path + "/", d, 0)
        return d


def rec_files(path, d, c):
	contents = os.listdir(path)
	name = path.split('/')[-2]
	l = list()

	for con in contents:
		if os.path.isfile(path + con):
			l.append({"file": [con, path+con]})
		elif os.path.isdir(path+con):
			l.append({"dir": rec_files(path+con+"/", d, c)})
	return [name, path, l]
	"""
        contents = os.listdir(path)
        for con in contents:
                if os.path.isfile(path + con):
                        filename = " " *c*2 + con
                        rel_path = path + con
                        d[filename] = rel_path
                elif os.path.isdir(path + con):
                        dirname = " " * c + con + "/"
                        rel_path = path + con + "/"
                        d[dirname] = rel_path
                        newd = rec_files(rel_path, d, c+1)
                        d = merge(d, newd)
        return d
	"""

@app.route('/')
@app.route('/index')
def index():
	if not session.get('logged_in'):
		return redirect(url_for('login'))
	online[session["username"]] = session["curr_project"]
	return render_template("index.html")


@app.route('/login', methods=['POST', 'GET'])
def login():

	if session.get("logged_in") and session["logged_in"]:
		return redirect(url_for("index"))

	if (request.method == 'POST'):
		session["username"] = request.form["username"]
		session["logged_in"] = True
		session["working_name"] = 'admin/Project';
		session["curr_project"] = 'Project';
		session["curr_file"] = ''
		return redirect(url_for("index"))

	return render_template('login.html');


@app.route('/logout')
def logout():
	if session['username'] in online:
		del online[session['username']]
	session['logged_in'] = False
	session["username"] = ''
	session["working_name"] = '';
	session["curr_project"] = '';
	session["working_name"] = '';
	return redirect(url_for("login"));


@app.route('/files', methods=['POST', 'GET'])
def files():
	d = get_files(session['working_name'])
	return jsonify(d)

@app.route('/collab', methods=['POST', 'GET'])
def collab():
	l = list()
	for user in online.keys():
		if online[user] == session["curr_project"]:
			l.append(user)
	return jsonify({"users": l})

@app.route('/get_contents', methods=['POST', 'GET'])
def get_contents():
    if request.method == 'POST':
        path = request.form['path']
        if path in open_files:
            content = open_files[path]
        else:
            with open(path, 'r') as f:
                content = f.read()
                open_files[path] = content
        return jsonify({"content": content})

@app.route('/update_file', methods=['POST'])
def update_file():
	if request.method == 'POST':
		path = request.form['path']
		#curr_name = request.form['curr_name']
		mode = request.form['mode']
		content = request.form['content']
		if mode == 'UPDATE':
			if path in open_files:
				open_files[path] = content
		if mode == 'SAVE':
			if path in open_files:
				open_files[path] = content
			if path == "":
				return
			with open(path, 'w') as f:
				f.write(content)
	return jsonify({})

@app.route('/run', methods=['POST'])
def run():
	if request.method == 'POST':
		path = request.form['path']
		#print(path)
		output = run_file(path)
		return jsonify({"output": output})

@app.route('/create', methods=['POST'])
def create():
	if request.method == 'POST':
		path = request.form['path']
		type = request.form['type']
		if type == 'DIR':
			os.system("mkdir -p {}".format(path))
		elif type == "FILE":
			os.system("touch {}".format(path))
		return jsonify({})


@app.route('/ses', methods=['POST'])
def ses():
	if request.method == 'POST':
		type = request.form['type']
		return jsonify({"ses": session[type]})

def get_proj(path):
	d = dict()
	d['users'] = list()
	content = os.listdir(path)
	for user in content:
		l = list()
		for proj in os.listdir(path + user):
			l.append(proj)
		d['users'].append([user, proj, path+user+'/'+proj])
	return d

@app.route('/projects', methods=['GET', 'POST'])
def projects():
	if request.method == 'GET':
		return render_template("projects.html")

	if request.method  == 'POST':
		return jsonify(get_proj('data/'))
