import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
// import { useEffect } from "react";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  // phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[]; //phNumber-array of objects
  age: number;
  dob: Date;
};

const YouTubeForm = () => {
  //useForms returns an object, which will help us to manage form data, submit form data, enforce validations and provide visual feedback

  //form-an object
  //register is a method which also returns methods like:  name, ref, onChange, onBlur
  //control is an object, which we should pass to DevTools component
  //formState is an object, from which we can destructure errors object

  //if we put defaultValues, we don't need to put types to useForm , like this :
  // const form = useForm<FormValues>({

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      // phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
  });

  //FOr example we want to get a data from json placeholder
  // const form = useForm({
  //   defaultValues: async () => {
  //     const response = await fetch(
  //       "https://jsonplaceholder.typicode.com/users/1"
  //     );
  //     const data = await response.json();
  //     return {
  //       username: "Batman",
  //       email: data.email,
  //       channel: "",
  //     };
  //   },
  // });

  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
  } = form; //getValues unlike watch won't trigger re-renders
  const {
    errors,
    touchedFields,
    dirtyFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
  } = formState;
  // console.log({touchedFields, dirtyFields, isDirty});
  // console.log({ isSubmitting, isSubmitted, isSubmitSuccessful });

  //Not to do like this, we call register in the input with spread operator
  // const { name, ref, onChange, onBlur } = register("username");

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmitFn = (data: FormValues) => {
    console.log("Form submitted", data);
  }; //when we pass onSubmitFn as an argument to handleSubmit method, it automatically receives form data

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  renderCount++;
  //with react hook form the component does not re-render on every change of the input value

  // const watchUsername = watch("username");
  // const watchSome = watch(["username", "email"]);
  // const watchAllForm = watch();
  // console.log(watchUsername);

  //With useEffect the component won't re-render every time the input value is changed
  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value, "****");
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const handleGetValues = () => {
    // console.log("Get values", getValues());
    const a = getValues();
    // console.log(a.username, "-----------");
  };

  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      //Reset also accepts some parameters such as values and options which allow as to customize the behavior of the reset method
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>
      {/* <h2> Watched value: {watchUsername}</h2> */}

      {/* handleSubmit accepts a second argument, which is the on ErrorHandler */}
      <form onSubmit={handleSubmit(onSubmitFn, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="userName">Username</label>
          {/* <input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur}/> */}

          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email format",
              },
              //for custom validations we use validate function
              validate: {
                //validate can be an object with different key, value pairs (notAdmin, notBlackListed... are just keys we decide what names to write)
                //fieldValue can also be a different name, its just an argument
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await fetch(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = await response.json();
                  return data.length === 0 || "Email already exists";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register("channel", {
              required: {
                value: true,
                message: "Channel is required",
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            {...register("social.twitter", {
              required: {
                value: true,
                message: "Twitter account is required",
              },
              // disabled: true,
              //Disabling conditionally
              disabled: watch("channel") === "",
            })}
          />
          <p className="error">{errors.social?.twitter?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>

        {/* <div className="form-control">
          <label htmlFor="primary-phone">Primary phone number</label>
          <input
            type="text"
            id="primary-phone"
            {...register("phoneNumbers.0", {
              required: {
                value: true,
                message: "Phone number is required",
              },
            })}
          />
        </div>

        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary phone number</label>
          <input
            type="text"
            id="secondary-phone"
            {...register("phoneNumbers.1")}
          />
        </div> */}

        {/* Dynamic fields with useFieldArray */}
        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>
        {/*Numeric and Date values  */}
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            {...register("age", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "Age is required",
              },
            })}
          />
          <p className="error">{errors.age?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of birth</label>
          <input
            type="date"
            id="dob"
            {...register("dob", {
              valueAsDate: true,
              required: {
                value: true,
                message: "Date of birth is required",
              },
            })}
          />
          <p className="error">{errors.dob?.message}</p>
        </div>

        <button disabled={!isDirty || !isValid}>Submit</button>
        {/* <button type="button" onClick={() => reset()}>
          Reset
        </button> */}
        {/* NOT RECOMMENDED to call reset inside submit button , instead we can check id isSubmittedSuccessful is true, then reset, inside the useEffect */}
        <button type="button" onClick={handleGetValues}>
          Get values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set value
        </button>
      </form>
      <DevTool control={control} />
    </div>
    //DevTools feedback is only for us during development
  );
};

export default YouTubeForm;
