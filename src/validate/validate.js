const constraints = {
  first_name: {
    presence: {allowEmpty: false},
  },
  middle_initial: {
    length: {
      maximum: 1,
      message: " must be 1 character maximum"
    }
  },
  last_name: {
    presence: {allowEmpty: false},
  },
  date_of_birth: {
    presence: {
      allowEmpty: false,
      message: " is required"
    },
    datetime: true,
  },
  phone_number: {
    presence: {allowEmpty: false},
    length: {
      minimum: 8,
      message: " must be at least 8 characters long"
    }
  },
  email_address: {
    presence: {allowEmpty: false},
    email: true,
  },
  address: {
    presence: {allowEmpty: false},
  },
  apartment: {
    presence: {allowEmpty: true},
  },
  city: {
    presence: {allowEmpty: false},
  },
  country: {
    presence: {
      allowEmpty: false,
      message: " must be selected"
    },
  },
  region: {
    presence: {
      allowEmpty: false,
      message: " must be selected"
    },
  },
  postal: {
    presence: {allowEmpty: false},
  },
  license_image: {
    presence: {
      allowEmpty: false,
      message: " must be uploaded"
    },
  },
  appointment_time: {
    presence: {
      allowEmpty: false,
      message: " must be selected"
    },
    datetime: true,
  },

};

export default constraints;