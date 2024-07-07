// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const e = {
  // This is a dictionary of validation error messages.
  // username
  usernameRequired: "username is required",
  usernameMin: "username must be at least 3 characters",
  usernameMax: "username cannot exceed 20 characters",
  // favLanguage
  favLanguageRequired: "favLanguage is required",
  favLanguageOptions: "favLanguage must be either javascript or rust",
  // favFood
  favFoodRequired: "favFood is required",
  favFoodOptions: "favFood must be either broccoli, spaghetti or pizza",
  // agreement
  agreementRequired: "agreement is required",
  agreementOptions: "agreement must be accepted",
};

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .required(e.favLanguageRequired)
    .oneOf(["javascript","rust"], e.favLanguageOptions),
  favFood: yup
    .string()
    .required(e.favFoodRequired)
    .oneOf(["pizza","broccoli", "spaghetti"], e.favFoodOptions),
  agreement: yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions),
});

console.log(formSchema)

const initialFormValues = () => ({
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: false,
});

const initialFormErrors = {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: "",
};

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // Create a state to track the values of the form. This state could be an object with `username`, `favLanguage`, `favFood`, and `agreement` keys.
  const [formValues, setFormValues] = useState(initialFormValues());
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  // (3) whether submit is disabled, (4) the success message from the server,
  const [submitDisabled, setSubmitDisabled] = useState(true);
  // and (5) the failure message from the server.
  const [serverSuccess, setServerSuccess] = useState("");
  const [serverFail, setServerFail] = useState("");

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(formValues).then((valid) => setSubmitDisabled(!valid));
  }, [formValues]);

  const validate = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => setFormErrors({...formErrors, [name]: ""}))
      .catch(err => setFormErrors({...formErrors, [name]: err.errors[0]}))
  }

  const onChange = (evt) => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    const {name, value, type, checked } = evt.target
    const currentValue = type === "checkbox" ? checked : value;
    validate(name, currentValue);
    setFormValues({...formValues, [name]: currentValue});
  };

  const onSubmit = (evt) => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    axios
      .post("https://webapis.bloomtechdev.com/registration", formValues)
      .then(res => {
          setServerSuccess(res.data.message)
          setServerFail()
          console.log(res)
          setFormValues(initialFormValues())
          setFormErrors(initialFormErrors)
      })
      .catch(err => {
        console.log(err)
        setServerFail(err.response.data.message)
        setServerSuccess()
      })
  };

  return (
    <div>
      {" "}
      {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
        {serverFail && <h4 className="error">{serverFail}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            onChange={onChange}
            id="username"
            name="username"
            type="text"
            placeholder="Type Username"
            value={formValues.username}
          />
          {formErrors.username && <div className="validation">{formErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input onChange={onChange} checked={formValues.favLanguage == "javascript"} type="radio" name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input onChange={onChange} checked={formValues.favLanguage == "rust"} type="radio" name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage && <div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={formValues.favFood} onChange={onChange} id="favFood" name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formErrors.favFood && <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input checked={formValues.agreement} onChange={onChange} id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
          {formErrors.agreement && <div className="validation">{formErrors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={submitDisabled} />
        </div>
      </form>
    </div>
  );
}
