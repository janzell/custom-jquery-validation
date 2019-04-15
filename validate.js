/**
 * Validation js
 *
 * Validate form base on css class
 * @author Janzell Jurilla
 */

// ----------------------------------------------------------*/

//validation object
var Validation;

/**
 * Validation Class
 */
Validation = function () {

    this.finalMessge = '';
    //store error message (array)
    this.message = '';
    //checking if the form entries are valid (bool)
    this.valid = '';
    //error message wrapper html
    this.msgWrapper = {
        start: '<div class="alert alert-danger">',
        end: '</div>'
    };

    //multi select fields holder
    this.multi_select_fields = [];

    //storage variable of any value
    this.storage = {question: ''};

    /**
     * Validate Form
     *
     * validate form upon submission
     * @param formId
     */
    this.validateForm = function (formId) {

        //assign default value for message, valid and multi select fields
        this.message = '<p> <strong>Fix the following error(s):</strong> </p>';
        this.valid = true;
        this.multi_select_fields = [];

        //get each element in the form
        var elem = document.getElementById(formId).elements;

        //exclude disabled elements
        for (var i = 0; i < elem.length; i++) {
            if ((!$(elem[i]).is(':disabled') && $(elem[i]).is(':visible') ) || $(elem[i]).hasClass('valid-age') || $(elem[i]).hasClass('includeValidate')) this.validateElement(formId, elem[i]);
        }

        //return message validation
        if (!this.valid) {
            this.setFinalMessage(this.message);
            return this.finalMessge;
        }

        return this.valid;
    };


    /**
     * Validate Element
     *
     * validate each element in the form
     * @param form
     * @param el
     */

    this.validateElement = function (form, el) {

        var id = el.id;
        var name = el.name;
        var type = $(el).attr('type');
        var tag = $(el).get(0).tagName;
        var value = $(el).val();
        var label = $(el).attr('alt');
        var regex;
        var text;

        //todo: use switch statement here...

        //validate required
        if ($(el).hasClass("required")) {

            //validate password
            if (type == 'text' || type == 'email' || type == 'password') {
                if ($.trim(value) == "" && value.length == 0) {
                    this.valid = false;
                    this.setMessage('The ' + label + ' field is required.');
                }
            }

            //validate checkbox and radio
            if (type == 'checkbox' || type == 'radio') {

                if ($('input[name=' + name + ']' + ':checked').length < 1) {
                    this.valid = false;
                    this.setMessage('The ' + label + ' field is required.');
                }

            }

            //validate select box
            if (tag == "SELECT") {
                if ($.trim(value) == "" || $.trim(value) == 'defaultVal') {
                    this.valid = false;
                    this.setMessage('The ' + label + ' field is required.');
                }
            }

            //validate textarea
            if (tag == "TEXTAREA") {
                if (!$.trim(value)) {
                    this.valid = false;
                    this.setMessage('The ' + label + ' field is required.');
                }
            }

        }

        //validate ccv
        if ($(el).hasClass("ccv")) {
            text = $(el).val();
            regex = /^[a-zA-Z0-9\s\[\]\.\-#']*$/;

            if (text.length != 4 && text.length != 3) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain a 3 or 4 characters.');
            }
        }

        //validate credit card information
        if ($(el).hasClass("creditCard")) {
            text = $(el).val();
            regex = /^[a-zA-Z0-9\s\[\]\.\-#']*$/;

            if (text.length > 19) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain not more than 19 characters.');
            }
        }

        // check for matching password
        if ($(el).hasClass('matches|password')) {

            if ($(el).val() != '' && $(el).val() != $.trim($('#' + form + ' #password').val())) {
                this.valid = false;
                this.setMessage('The ' + label + ' field doesn\'t match with the Password field.');
            }
        }

        //check if the field only contains number
        if ($(el).hasClass("number") || $(el).hasClass("numberOnly")) {

            regex = /^[0-9]+$/i;
            text = $(el).val();
            if (!regex.test(text)) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain only numbers');
            }
        }


        //check if the field only contains contact number
        if ($(el).hasClass("contact_number")) {
            regex = /^[0-9\-\ \(\)]+$/i;
            if ($(el).val() && !regex.test($(el).val())) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain only numbers.');
            }

        }

        //check if the decimal is number
        if ($(el).hasClass("decimal")) {
            text = $(el).val();
            var isANumber = isNaN(text.replace(/[$,]/g, "")) === false;

            if (!isANumber) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain only numeric numbers.');
            }
        }

        //check if alpha numeric
        if ($(el).hasClass("alpha_numeric")) {
            text = $(el).val();
            regex = /^[a-zA-Z0-9\s\[\]\.\-#']*$/;

            if (!regex.test(text)) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should only contain alpha numeric characters.');
            }
        }

        //check if minimum of 8 characters
        if ($(el).hasClass("passwordFormat")) {

            text = $(el).val();
            regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

            if (!regex.test(text)) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain a Minimum 8 characters and at least 1 Alphabet and 1 Number:.');
            }
        }

      
        // check username is duplicate
        if ($(el).hasClass("inValidEmailAddress")) {
            var email = $(el).val();
            if (email == '') {
                this.valid = false;
                this.setMessage('Sorry, we can\'t verify your Email Address.');
            }
        }

        //check if minimum of 8 characters
        if ($(el).hasClass("usernameFormat")) {
            text = $(el).val();
            regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~`!@#$%^&*()_+|=\-{}\[\]:;"'<,>.?\/\\]).{8,}$/;
            // var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_\-]).{8,}$/;

            if (!regex.test(text)) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain a Minimum 8 characters and at least 1 number, 1 capital and 1 special character.');
            }
        }
        
        //check valid email
        if ($(el).hasClass("email") && $(el).val() != "") {

            regex = /^([*+!.&#$¦\'\\%\/0-9a-z^_`{}=?~:-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,4})$/i;
            if (!regex.test($(el).val())) {
                this.valid = false;

                if (label == "") {
                    label = $(el).parent('.control-group').children('label').text();
                }

                this.setMessage('The ' + label + ' field must contain a valid email address.');
            }
        }

        // check if the age is valid 18 minimum
        if ($(el).hasClass("valid-age")) {

            var validAge = 18;

            if ($('#state').val() == 'AL') {
                validAge = 19;
            }

            if ($(el).val() < validAge) {
                this.valid = false;
                this.setMessage('An Applicant needs to be ' + validAge + ' years old to Apply for Credit.');
            }
        }


        //validate from and to values
        if ($(el).hasClass("from") && $(el).val() != "") {
            var from = $(el).val();
            var to = $(el).siblings('.to').val();

            /*if (to == "") {
             this.valid = false;
             this.setMessage('The ' + label +' to field must not be empty.');
             }else{*/
            if ($(el).hasClass("date")) {
                from = new Date(from).getTime();
                to = new Date(to).getTime();
                if (from > to) {
                    this.valid = false;
                    this.setMessage('The ' + label + ' start range must be lesser than the end range.');
                }
            } else {
                from = from.replace(/[$,]/g, "");
                to = to.replace(/[$,]/g, "");
                label = label.replace("to", "");
                var from_value = parseInt(from);
                var to_value = parseInt(to);

                if (from_value > to_value) {
                    this.valid = false;
                    this.setMessage('The ' + label + ' start range must be lesser than the end range.');
                }
            }
            //}
        }
    };

    this.setFinalMessage = function (msg) {
        this.finalMessge = this.msgWrapper.start + msg + this.msgWrapper.end;
    };

    /**
     * Set Message
     *
     * set validation message
     * @param msg
     */
    this.setMessage = function (msg) {
        this.message += msg + "<br>";
    };
};

var ValidateObj = new Validation();

/**
 * Trigger Validation
 *
 * @param event
 * @return
 */
$('.validate').submit(function (event) {

    var formNotification = $("#form-notification");
    var notification;

    if (formNotification.size() == 1) {
        notification = formNotification;
    } else {
        notification = $('#notification');
    }

    if (isValidResult = ValidateObj.validateForm(this.id) != true) {
        notification.html(isValidResult);
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
    }

    return true;
});
