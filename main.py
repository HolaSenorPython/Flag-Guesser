from flask import Flask, redirect, url_for, render_template, flash, request
from flask_bootstrap import Bootstrap5
from forms import ContactForm # grab our contact form from forms.py
import smtplib # Use for sending emails
from email.message import EmailMessage # Also for sending emails
import os
from dotenv import load_dotenv


load_dotenv() # Load from the env

# Define send email function for later
def send_email(name, email, message):
    my_email = os.environ.get('MY_EMAIL_FOR_USER')
    my_password = os.environ.get('MY_PASS_FOR_USER')
    users_name = name
    users_email = email
    users_message = message

    # Make email message object
    msg = EmailMessage()
    msg['Subject'] = f"You've received a contact form message from {users_name}!"
    msg["From"] = my_email # Has to be my email so that Google doesn't trip out and assume its a bot
    msg["To"] = my_email # Same here
    msg['Reply-To'] = users_email # When I reply, it goes to THEIR email!

    # This is email body
    body = f"""\
Name: {users_name}
Email: {users_email}
Location: Flag Guesser Website

Message: {users_message}
    """
    msg.set_content(body, charset='utf-8')

    # Now do email sending stuff
    try:
        with smtplib.SMTP("smtp.gmail.com", port=587) as connection:
            connection.starttls()
            connection.login(user=my_email, password=my_password) # Use my email n' pass when logging in
            connection.send_message(msg=msg)
        return True
    except Exception as e:
        print("Error sending email: {e}")
        return False

app = Flask(__name__) # App is equal to name of this file, app should run here
app.config["SECRET_KEY"] = os.environ.get("FLASK_KEY") # Secret flask key for forms n stuff
bootstrap = Bootstrap5(app=app)

# Le homepage
@app.route('/')
def home():
    return render_template('index.html')

# Route for gamepage
@app.route('/game-page')
def gamepage():
    return render_template('gamepage.html')

# Route for contact me
@app.route('/contact-me', methods=['GET', 'POST'])
def contact_me():
    email_sent = None # Set it as none to start, it needs to exist as SOMETHING to be used later
    contact_form = ContactForm() # Init the contact form, save it in variable called form
    if contact_form.validate_on_submit(): # If post request is made
        user_name = contact_form.name.data
        user_email = contact_form.email.data
        user_message = contact_form.message.data
        email_sent = send_email(user_name, user_email, user_message) # Returns boolean after work is done, so lets check against it!
        if email_sent:
            flash("Success! Your email was sent successfully!✅", category='success')
        else:
            flash("Oops! Something went wrong while sending your message.😿", category='danger')
        return redirect(url_for("contact_me", email_sent=email_sent)) # Redirect back to contact page and flash msg
    
    # Get the argument 'email sent' from memory? (Does this outside of if, cause we NEED an email sent variable to use in html doc with jinja)
    email_sent_param = request.args.get('email_sent') 
    if email_sent_param == 'True':
        email_sent = True
    elif email_sent_param == 'False':
        email_sent = False

    return render_template('contact.html', form=contact_form, email_sent=email_sent) # Use parameter 'form' in html to render form and stuff


# Instructions for running app
if __name__ == "__main__": # Only run the app if its executed from here!
    app.run(debug=True, use_reloader=True) # Debug mode true, allow flask to reload true so we can see changes live
