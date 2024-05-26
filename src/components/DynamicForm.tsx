import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./styles.css"; // Import custom CSS

interface Option {
  label: string;
  value: string;
}

interface FieldConfig {
  id: string;
  name: string;
  type: string;
  required: boolean;
  regex?: string;
  multipleSelect?: boolean;
  options?: Option[];
  fileFormatSupported?: string[];
}

interface DynamicFormProps {
  config: FieldConfig[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
  const initialValues: { [key: string]: any } = {};
  const validationSchema: { [key: string]: any } = {};

  config.forEach((field) => {
    if (
      (field.type === "select" && field.multipleSelect) ||
      field.type === "checkbox"
    ) {
      initialValues[field.name] = [];
      validationSchema[field.name] = field.required
        ? Yup.array().min(1, "At least one selection is required")
        : Yup.array();
    } else {
      initialValues[field.name] = "";
      if (field.required) {
        validationSchema[field.name] = Yup.string().required("Required");
      }
      if (field.regex) {
        const regex = new RegExp(field.regex);
        const regexErrorMessage = "Invalid format";
        validationSchema[field.name] = Yup.string()
          .required("Required")
          .test("regex", regexErrorMessage, (value) => {
            return !value || regex.test(value);
          });
      }
    }
  });

  const formSchema = Yup.object().shape(validationSchema);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(setSubmitting);
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="container form-container">
          <div className="row">
            {config.map((field, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <label htmlFor={field.name} className="form-label">
                  {field.name}
                  {field.required && (
                    <span className="text-danger">*</span>
                  )}{" "}
                  {/* Add asterisk for required fields */}
                </label>
                {renderField(field)}
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-danger"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

const renderField = (field: FieldConfig) => {
  switch (field.type) {
    case "text":
    case "password":
      return (
        <Field name={field.name} type={field.type} className="form-control" />
      );
    case "select":
      return (
        <Field
          as="select"
          name={field.name}
          multiple={field.multipleSelect}
          className="form-select"
        >
          {!field.multipleSelect && <option value="">Select</option>}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
      );
    case "radio":
      return field.options?.map((option) => (
        <div className="form-check" key={option.value}>
          <Field
            type="radio"
            name={field.name}
            value={option.value}
            className="form-check-input"
          />
          <label className="form-check-label">{option.label}</label>
        </div>
      ));
    case "checkbox":
      return field.options?.map((option) => (
        <div className="form-check" key={option.value}>
          <Field
            type="checkbox"
            name={field.name}
            value={option.value}
            className="form-check-input"
          />
          <label className="form-check-label">{option.label}</label>
        </div>
      ));
    case "file":
      return (
        <Field
          name={field.name}
          type="file"
          className="form-control"
          accept={field.fileFormatSupported?.join(",")}
        />
      );
    default:
      return null;
  }
};

export default DynamicForm;
