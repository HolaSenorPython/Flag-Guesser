from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, EmailField
from wtforms.validators import DataRequired, Email

# File will contain forms code!

# Contact Form!
class ContactForm(FlaskForm):
    email = EmailField(label="Enter your email in the section below:", validators=[DataRequired(), Email()])
    name = StringField(label="Enter your name.", validators=[DataRequired()])
    message = StringField(label="Your message: (What do you want to say to me?)", validators=[DataRequired()])
    send_msg = SubmitField("Send your message!📧")