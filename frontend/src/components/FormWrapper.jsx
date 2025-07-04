import React from "react";
import FormInputGrup from "./FormInputGrup";

const FormWrapper = ({
  title,
  subtitle,
  fields,
  onSubmit,
  formData,
  onChange,
  submitLabel = "Submit",
  columns = 1,
}) => {
  return (
    <form
      action=""
      onSubmit={onSubmit}
      className=" bg-white dark:bg-gray-700 w-full px-6 rounded-xl z-20"
    >
      <p className="text-2xl md:text-3xl font-semibold">{title}</p>
      <p className="text-gray-400 pb-8">{subtitle}</p>
      <div
        className={`grid gap-4 ${
          columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <FormInputGrup
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name] || ""}
              onChange={onChange}
              option={field.option}
            />
          </div>
        ))}
      </div>
      <button className="bg-blue-500 dark:bg-orange-500 text-white h-10 rounded-lg w-full mt-8">{submitLabel}</button>
    </form>
  );
};

export default FormWrapper;
