from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import password
import create_db
app = Flask(__name__, static_folder='static')
CORS(app, origins=["http://localhost:3000"]) # allow outside source (frontend)

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:{password.PASSWORD}@localhost:3306/Job_Nest'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['TEMPLATES_AUTO_RELOAD'] = True

db = SQLAlchemy(app)

# ---------- MODELS ----------


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    fname = db.Column(db.String(255), nullable=False)
    lname = db.Column(db.String(255), nullable=False)


    resumes = db.relationship('Resume', backref='user', lazy=True)
    posted_jobs = db.relationship('Job', backref='user', lazy=True)


class UserInterestedJob(db.Model):
    __tablename__ = 'user_interested_jobs'
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), primary_key=True)


class Resume(db.Model):
    __tablename__ = 'resumes'

    resume_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    resume_style = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    contact_info = db.Column(db.Text, nullable=False)

    skills = db.relationship('Skill', backref='resume', lazy=True)
    educations = db.relationship('Education', backref='resume', lazy=True)
    experiences = db.relationship('Experience', backref='resume', lazy=True)
    submissions = db.relationship('HandedTo', backref='resume', lazy=True)


class Skill(db.Model):
    __tablename__ = 'skills'
    skill_name = db.Column(db.String(100), primary_key=True)
    resume_id = db.Column(db.String(100), db.ForeignKey('resumes.resume_style'), primary_key=True)


class Education(db.Model):
    __tablename__ = 'education'
    education_received = db.Column(db.String(255), primary_key=True)
    resume_id = db.Column(db.String(100), db.ForeignKey('resumes.resume_style'), primary_key=True)


class Experience(db.Model):
    __tablename__ = 'experience'
    experience_worked = db.Column(db.String(255), primary_key=True)
    resume_id = db.Column(db.String(100), db.ForeignKey('resumes.resume_style'), primary_key=True)


class Company(db.Model):
    __tablename__ = 'companies'
    company_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    location = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer(10), nullable = True)

    jobs = db.relationship('Job', backref='company', lazy=True)
    submissions = db.relationship('HandedTo', backref='company', lazy=True)


class HandedTo(db.Model):
    __tablename__ = 'handed_to'
    resume_id = db.Column(db.String(100), db.ForeignKey('resumes.resume_style'), primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), primary_key=True)
    submission_date = db.Column(db.Date, nullable=False)


class Job(db.Model):
    __tablename__ = 'jobs'
    job_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    availability = db.Column(db.Boolean, nullable=False)
    salary = db.Column(db.Numeric(10, 2), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=False)
    requirements = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    economy = db.relationship('Economy', backref='job', uselist=False)
    management = db.relationship('Management', backref='job', uselist=False)
    engineering = db.relationship('Engineering', backref='job', uselist=False)
    medical = db.relationship('Medical', backref='job', uselist=False)


class Economy(db.Model):
    __tablename__ = 'economy'
    economy_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Management(db.Model):
    __tablename__ = 'management'
    management_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Engineering(db.Model):
    __tablename__ = 'engineering'
    engineering_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


class Medical(db.Model):
    __tablename__ = 'medical'
    medical_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), unique=True, nullable=False)


# ---------- ROUTES ----------

@app.route('/')
def home():
    return '<h1>HOME</h1>'

@app.route('/test_db')
def test_db():
    try:
        # Simple test query
        db.session.execute('SELECT 1')
        return {'message': 'Database connected successfully'}, 200
    except Exception as e:
        return {'message': 'Database connection failed', 'error': str(e)}, 500


@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    lname = data.get('lastName')
    fname = data.get('firstName')

    print(data, email, password)
    
    if None in (email, password, username, fname, lname):
        return {'message': 'Email, password, username, and first/last name are required'}, 400

    if User.query.filter_by(email=email).first():
        return {'message': 'Email already exists'}, 409

    hashed_password = generate_password_hash(password) # hash implemented
    user = User(email=email, password=hashed_password, username=username, fname=fname, lname=lname)
    db.session.add(user)
    db.session.commit()
    return {'message': 'User created', 'user_id': user.user_id}, 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    print(username, password)
    print(user.password)
    if not user or not check_password_hash(user.password, password):
        return {'message': 'Invalid username or password'}, 401

    return {'message': 'Login successful', 'user_id': user.user_id}, 200


@app.route('/edit_user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return {'message': 'User not found'}, 404

    data = request.get_json()
    
    # Update only if provided
    if 'email' in data:
        if User.query.filter_by(email=data['email']).first() and user.email != data['email']:
            return {'message': 'Email already in use'}, 409
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])
    if 'username' in data:
        user.username = data['username']
    if 'firstName' in data:
        user.fname = data['firstName']
    if 'lastName' in data:
        user.lname = data['lastName']

    db.session.commit()
    return {'message': f'User {user_id} updated successfully'}, 200



@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return {'message': 'User not found'}, 404

    db.session.delete(user)
    db.session.commit()
    
    return {'message': f'User {user_id} deleted successfully'}, 200



@app.route('/create_resume', methods=['POST'])
def create_resume():
    data = request.get_json()
    resume_style = data.get('resume_style')
    user_id = data.get('user_id')
    contact_info = data.get('contact_info')

    if not all([resume_style, user_id, contact_info]):
        return {'message': 'All fields are required'}, 400

    if Resume.query.filter_by(user_id=user_id).first():
        return {'message': 'Resume already exists for this user'}, 409

    resume = Resume(resume_style=resume_style, user_id=user_id, contact_info=contact_info)
    db.session.add(resume)
    db.session.commit()
    return {'message': 'Resume created'}, 201


@app.route('/add_skill', methods=['POST'])
def add_skill():
    data = request.get_json()
    skill_name = data.get('skill_name')
    resume_id = data.get('resume_id')

    skill = Skill(skill_name=skill_name, resume_id=resume_id)
    db.session.add(skill)
    db.session.commit()
    return {'message': 'Skill added'}, 201


@app.route('/add_education', methods=['POST'])
def add_education():
    data = request.get_json()
    education_received = data.get('education_received')
    resume_id = data.get('resume_id')

    edu = Education(education_received=education_received, resume_id=resume_id)
    db.session.add(edu)
    db.session.commit()
    return {'message': 'Education added'}, 201


@app.route('/add_experience', methods=['POST'])
def add_experience():
    data = request.get_json()
    experience_worked = data.get('experience_worked')
    resume_id = data.get('resume_style')

    exp = Experience(experience_worked=experience_worked, resume_style=resume_id)
    db.session.add(exp)
    db.session.commit()
    return {'message': 'Experience added'}, 201


@app.route('/create_company', methods=['POST'])
def create_company():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')

    # Check if company exists
    if Company.query.filter_by(name=name).first():
        return {'message': 'Company already exists'}, 409

    # Create company
    company = Company(name=name, location=location)
    db.session.add(company)
    db.session.commit()

    return {'message': 'Company created', 'company_id': company.company_id}, 201

@app.route('/users/<int:user_id>/interested_companies', methods=['GET'])
def get_user_interested_companies(user_id):
    #Get all job IDs the user is interested in
    job_ids = db.session.query(UserInterestedJob.job_id).filter_by(user_id=user_id).subquery()

    #Join jobs with companies based on those job IDs
    companies = db.session.query(Company).join(Job).filter(Job.job_id.in_(job_ids)).distinct().all()

    #Return company info
    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location
    } for c in companies])



@app.route('/create_job', methods=['POST'])
def create_job():
    data = request.get_json()
    job = Job(
        availability=data['availability'],
        salary=data['salary'],
        company_id=data['company_id'],
        requirements=data['requirements'],
        user_id=data['user_id']
    )
    db.session.add(job)
    db.session.commit()
    
    return {'message': 'Job created'}, 201


@app.route('/add_econ_job', methods=['POST'])
def add_econ_job():
    data = request.get_json()
    job_id = data.get('job_id')

    # Check if job exists
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job not found'}, 404

    # Check if the job already has an Economy category associated
    if Economy.query.filter_by(job_id=job_id).first():
        return {'message': 'Job already has an Economy category associated'}, 409

    # Create Economy entry
    econ = Economy(job_id=job_id)
    db.session.add(econ)
    db.session.commit()

    return {'message': 'Economy category added to job'}, 201


@app.route('/add_medical_job', methods=['POST'])
def add_medical_job():
    data = request.get_json()
    job_id = data.get('job_id')

    # Check if job exists
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job not found'}, 404

    # Check if the job already has a Medical category associated
    if Medical.query.filter_by(job_id=job_id).first():
        return {'message': 'Job already has a Medical category associated'}, 409

    # Create Medical entry
    medical = Medical(job_id=job_id)
    db.session.add(medical)
    db.session.commit()

    return {'message': 'Medical category added to job'}, 201


@app.route('/add_management_job', methods=['POST'])
def add_management_job():
    data = request.get_json()
    job_id = data.get('job_id')

    # Check if job exists
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job not found'}, 404

    # Check if the job already has a Management category associated
    if Management.query.filter_by(job_id=job_id).first():
        return {'message': 'Job already has a Management category associated'}, 409

    # Create Management entry
    management = Management(job_id=job_id)
    db.session.add(management)
    db.session.commit()

    return {'message': 'Management category added to job'}, 201


@app.route('/add_engineering_job', methods=['POST'])
def add_engineering_job():
    data = request.get_json()
    job_id = data.get('job_id')

    # Check if job exists
    job = Job.query.get(job_id)
    if not job:
        return {'message': 'Job not found'}, 404

    # Check if the job already has an Engineering category associated
    if Engineering.query.filter_by(job_id=job_id).first():
        return {'message': 'Job already has an Engineering category associated'}, 409

    # Create Engineering entry
    engineering = Engineering(job_id=job_id)
    db.session.add(engineering)
    db.session.commit()

    return {'message': 'Engineering category added to job'}, 201

@app.route('/save_job', methods=['POST'])
def save_job():
    data = request.get_json()
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    if not all([user_id, job_id]):
        return {'message': 'User ID and Job ID required'}, 400

    existing = UserInterestedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if existing:
        return {'message': 'Job already saved'}, 409

    saved = UserInterestedJob(user_id=user_id, job_id=job_id)
    db.session.add(saved)
    db.session.commit()

    return {'message': f'Job {job_id} saved for user {user_id}'}, 201

@app.route('/remove_saved_job', methods=['DELETE'])
def remove_saved_job():
    data = request.get_json()
    user_id = data.get('user_id')
    job_id = data.get('job_id')

    if not all([user_id, job_id]):
        return {'message': 'User ID and Job ID required'}, 400

    saved = UserInterestedJob.query.filter_by(user_id=user_id, job_id=job_id).first()
    if not saved:
        return {'message': 'Saved job not found'}, 404

    db.session.delete(saved)
    db.session.commit()

    return {'message': f'Job {job_id} removed from saved list for user {user_id}'}, 200




# ---------- QUERIES ----------

@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([{
        'user_id': user.user_id,
        'email': user.email,
        'looking_for_job': user.looking_for_job
    } for user in users])


@app.route('/resumes', methods=['GET'])
def get_all_resumes():
    resumes = Resume.query.all()
    return jsonify([{
        'resume_style': r.resume_style,
        'user_id': r.user_id,
        'contact_info': r.contact_info
    } for r in resumes])


@app.route('/jobs', methods=['GET'])
def get_all_jobs():
    jobs = Job.query.all()
    return jsonify([{
        'job_id': j.job_id,
        'availability': j.availability,
        'salary': float(j.salary),
        'company_id': j.company_id,
        'requirements': j.requirements,
        'user_id': j.user_id
    } for j in jobs])


@app.route('/companies', methods=['GET'])
def get_all_companies():
    companies = Company.query.all()
    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location
    } for c in companies])


@app.route('/users/<int:user_id>/interested_jobs', methods=['GET'])
def get_interested_jobs(user_id):
    job_ids = [t[0] for t in db.session.query(UserInterestedJob.job_id).filter_by(user_id=user_id).all()]
    jobs = Job.query.filter(Job.job_id.in_(job_ids)).all()
    return jsonify([{
        'job_id': j.job_id,
        'availability': j.availability,
        'salary': float(j.salary),
        'requirements': j.requirements,
        'company_id': j.company_id,
        'user_id': j.user_id
    } for j in jobs])

@app.route('/users/<int:user_id>/Companies', methods=['GET'])
def user_Companies(user_id):
    user_jobs = [t[0] for t in db.session.query(UserInterestedJob.job_id).filter_by(user_id=user_id).all()]
    
    job_company = user_jobs.join(Company).filter(Job.company_id == Company.company_id)

    return jsonify([{
        'company_id': c.company_id,
        'name': c.name,
        'location': c.location
    } for c in job_company])


@app.route('/search_jobs', methods=['GET'])
def search_jobs():
    # Get query parameters from the request
    keyword = request.args.get('keyword', default='', type=str)
    location = request.args.get('location', default='', type=str) #for jobs
    min_salary = request.args.get('min_salary', default=0, type=float)
    job_type = request.args.get('job_type', default='', type=str)

    # Build the query dynamically based on the filters provided
    query = Job.query
    job_lcoation = query.join(Company).filter(Job.company_id == Company.company_id)

    if keyword:
        query = query.filter(Job.requirements.ilike(f'%{keyword}%'))  # Filter jobs based on keyword in requirements

    if location:
        query = query.filter(job_lcoation.ilike(f'%{location}%'))  # Filter jobs based on location

    if min_salary:
        query = query.filter(Job.salary >= min_salary)  # Filter jobs with a minimum salary

    if job_type:
        if job_type.lower() == 'economy':
            query = query.join(Economy).filter(Economy.job_id == Job.job_id) 
        elif job_type.lower() == 'engineering':
            query = query.join(Engineering).filter(Engineering.job_id == Job.job_id) 
        elif job_type.lower() == 'medical':
            query = query.join(Medical).filter(Medical.job_id == Job.job_id) 
        elif job_type.lower() == 'management':
            query = query.join(Management).filter(Management.job_id == Job.job_id)

    jobs = query.all()

    # Return the filtered list of jobs
    return jsonify([{
        'job_id': job.job_id,
        'availability': job.availability,
        'salary': float(job.salary),
        'company_id': job.company_id,
        'requirements': job.requirements,
        'location': job.company.location,
        'job_type': job_type.capitalize() if job_type else 'Unknown'
    } for job in jobs])



# ---------- APP ENTRY ----------

if __name__ == '__main__':
    create_db.create_db()
    with app.app_context():
        db.drop_all()   # Drops all existing tables
        db.create_all() # Recreates tables from models
    app.run(host='0.0.0.0', port=80)
