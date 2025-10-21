import { useForm } from "react-hook-form";

// Define the shape of our form data
type FormData = {
  name: string;
  email: string;
  password: string;
  age: number;
};

// Add simple, reusable styles for nicer spacing and visuals
const styles = {
  container: {
    maxWidth: 440,
    margin: "40px auto",
    padding: 24,
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
  },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14
  },
  error: { color: "#b91c1c", fontSize: 12, marginTop: 4 },
  button: {
    width: "100%",
    marginTop: 8,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid transparent",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer" as const
  },
  helperText: { marginTop: 12, fontSize: 13, color: "#6b7280" }
} as const;

export default function RegisterForm() {
  // useForm hook initializes the form
  const {
    register,          // connects inputs to form
    handleSubmit,      // wraps submit handler
    watch,             // watches field values
    reset,             // resets form to initial values
    formState: { errors, isSubmitting } // holds errors and form status
  } = useForm<FormData>();

  // Function that will be called when form is submitted successfully
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("User Registered Successfully!");
    reset(); // clear the form
  };

  // You can also watch values in real-time
  const currentEmail = watch("email");

  return (
    <div style={styles.container}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name field */}
        <div style={styles.field}>
          <label style={styles.label}>Name:</label>
          <input
            style={{
              ...styles.input,
              ...(errors.name ? { borderColor: "#dc2626", background: "#fff1f2" } : {})
            }}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" }
            })}
          />
          {errors.name && <p style={styles.error}>{errors.name.message}</p>}
        </div>

        {/* Email field */}
        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input
            style={{
              ...styles.input,
              ...(errors.email ? { borderColor: "#dc2626", background: "#fff1f2" } : {})
            }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@]+@[^@]+\.[^@]+$/,
                message: "Enter a valid email"
              }
            })}
          />
          {errors.email && <p style={styles.error}>{errors.email.message}</p>}
        </div>

        {/* Password field */}
        <div style={styles.field}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            style={{
              ...styles.input,
              ...(errors.password ? { borderColor: "#dc2626", background: "#fff1f2" } : {})
            }}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be 6+ characters" }
            })}
          />
          {errors.password && <p style={styles.error}>{errors.password.message}</p>}
        </div>

        {/* Age field */}
        <div style={styles.field}>
          <label style={styles.label}>Age:</label>
          <input
            type="number"
            style={{
              ...styles.input,
              ...(errors.age ? { borderColor: "#dc2626", background: "#fff1f2" } : {})
            }}
            {...register("age", {
              valueAsNumber: true,
              required: "Age is required",
              min: { value: 18, message: "Must be 18 or older" }
            })}
          />
          {errors.age && <p style={styles.error}>{errors.age.message}</p>}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </form>

      <p style={styles.helperText}>
        Watching email: {currentEmail || "none"}
      </p>
    </div>
  );
}
