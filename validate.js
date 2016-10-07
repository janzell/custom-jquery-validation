/**
 * Validation js
 *
 * Validate form base on css class
 * @author Global Fusion
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

        //validate other specified / special element
        //agreement
        if ($(el).hasClass("agreement")) {

            if (type == 'checkbox' || type == 'radio') {

                if ($('input[name=' + name + ']' + ':checked').length < 1) {
                    label = $('#' + id).parents().eq(1).children('label').text();
                    this.valid = false;
                    this.setMessage('This is for agreement validation');
                }
            }
        }

        //validate rent amount must not equal to 0 or below
        if ($(el).hasClass("rentAmount")) {

            if ($(el).val() < 1) {
                this.setMessage('The ' + label + ' value must not be 0');
                this.valid = false;
            }

        }

        if ($(el).hasClass("annualGrossIncome")) {

            if ($(el).val() < 1) {
                this.setMessage('The ' + label + ' value must not be 0');
                this.valid = false;
            }

        }


        //validate monthly mortage must not be zero
        if ($(el).hasClass("greaterThanZero")) {

            if ($(el).val() == 0) {
                this.valid = false;
                this.setMessage(label + ' must be greater than zero');
            }
        }


        // validate rent amount greater than 800 else confirmation modal pop up
        if ($(el).hasClass("confirmRentAmount")) {

            if ($(el).val() < 800 && $(el).val() > 0) {

                $('#ra-modal').modal({
                    keyboard: false,
                    backdrop: false
                });

                this.valid = false;
                this.setMessage('Please confirm the value for ' + label + '.');
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
        if ($(el).hasClass("duplicateUsername")) {

            var username = $(el).val();

            if (username != '') {
                this.valid = false;
                this.setMessage('The username: ' + username + ' already exists, please create a unique one.');
            }

        }

        // check username is duplicate
        if ($(el).hasClass("inValidEmailAddress")) {

            console.log(el);

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

        //check if minimum of 8 characters
        if ($(el).hasClass("loanAmountFormat")) {

            text = parseInt($(el).val());

            if (text < 2600 || text > 15000) {
                this.valid = false;
                this.setMessage('The ' + label + ' amount should be greated than $2600 and less than $15000.');
            }
        }

        //check if minimum of 8 characters
        if ($(el).hasClass("minimum8")) {
            text = $(el).val();
            regex = /^[a-zA-Z0-9\s\[\]\.\-#']*$/;

            if (text.length < 8) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain a minimum of 8 characters.');
            }
        }


        //check if minimum of 8 characters
        if ($(el).hasClass("accountNumber")) {
            text = $(el).val();
            regex = /^[0-9\s\[\]\.\-#']*$/;

            if (text.length != 9) {
                this.valid = false;
                this.setMessage('The ' + label + ' field should contain 9 characters.');
            }
        }

        //check if maximum of 20 characters
        if ($(el).hasClass("maximum20")) {
            text = $(el).val();
            regex = /^[a-zA-Z0-9\s\[\]\.\-#']*$/;

            if (text.length > 20) {
                this.valid = false;
                this.setMessage('The ' + label + ' field has exceeded more than 20 characters.');
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

        //validate date format
        if ($(el).hasClass("date") && $(el).val() != "") {

            // var date = $(el).val();
            // var bits = date.split('-');
            // var d    = new Date(date);

            // if (d.getMonth() != (bits[1] - 1) || d.getDate() != bits[2] || d.getFullYear() !=  bits[0] ) {
            //     this.valid = false;
            //     this.setMessage('The ' + label + ' must contain a valid date format. (yyyy-mm-dd)');
            // }
        }

        //check if valid time format
        if ($(el).hasClass("time") && $(el).val() != "") {
            regex = /^(([0-1])|([0][0-9])|([1][0-2])):([0-5]?[0-9]) (A|P)M?$/i;
            if (!regex.test($(el).val())) {
                this.valid = false;
                this.setMessage('The ' + label + ' must contain a valid time format. (e.g. 09:00 AM)');
            }
        }

        //check if question 1 differs to question 2
        if ($(el).hasClass("question")) {

            if (this.storage['question'] == $(el).val()) {
                this.valid = false;
                this.setMessage('Please use a different security Question from Question  2');
                this.storage['question'] = "";
            } else
                this.storage['question'] = $(el).val();
        }


        //check if Primary Phone number differs to Seconday Phone Number
        if ($(el).hasClass("PhoneNr")) {

            if (this.storage['PhoneNr'] == $(el).val()) {
                this.valid = false;
                this.setMessage('Please use a different Phone Number from Primary Phone Number.');
                this.storage['PhoneNr'] = "";
            } else
                this.storage['PhoneNr'] = $(el).val();
        }


        //check the format phonenumber of the security question if phone number is selected
        if ($(el).hasClass('answerFormat')) {

            regex = /^([0-9]{3})-([0-9]{3})-([0-9]{4})$/;

            if (!regex.test($(el).val())) {
                this.valid = false;
                this.setMessage('Enter phone number for ' + label + '. (format 000-000-0000)');
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

        // only CA state is valid
        if ($(el).hasClass('valid-state')) {

            if ($(el).val() != 'CA') {
                this.valid = false;
                this.setMessage('Ascend is currently only accepting applications for credit in California');
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

    if( formNotification.size() == 1 )
        notification = formNotification;
    else
        notification = $('#notification');

    var isValidResult = ValidateObj.validateForm(this.id);

    if (isValidResult != true) {

        var stepId = $(this).attr('id');

        if (stepId == 'CreditCheckForm' || stepId == 'EmploymenVerificationForm'
            || stepId == 'lendingTreeLPForm' || stepId == 'UserAccountForm') {
            $('body').scrollTo(notification, 500, {offset: -60});
        }

        notification.html(isValidResult);

        event.stopImmediatePropagation();
        event.preventDefault();

        return false;
    }

    return true;

});

/**
 * Trigger Validation for Modal
 *
 * @param event
 * @return
 */
$('.validateModal').submit(function (event) {

    var isValidResult = ValidateObj.validateForm(this.id);

    if (isValidResult != true) {

        $('#notificationModal').html(isValidResult);

        event.stopImmediatePropagation();
        event.preventDefault();

        return false;

    }

    return true;

});

//Todo: remove this or transfer
$('[data-toggle="tooltip"]').tooltip();
