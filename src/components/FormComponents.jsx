export const FormInput = ({ label, name, value, onChange, type = 'text', placeholder, error, required }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label} {required && <span className="required">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`form-input ${error ? 'form-input-error' : ''}`}
            required={required}
        />
        {error && <span className="form-error">{error}</span>}
    </div>
);

export const FormSelect = ({ label, name, value, onChange, options, error, required }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label} {required && <span className="required">*</span>}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`form-select ${error ? 'form-input-error' : ''}`}
            required={required}
        >
            <option value="">Select {label}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <span className="form-error">{error}</span>}
    </div>
);

export const FormTextarea = ({ label, name, value, onChange, placeholder, rows = 3, error, required }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label} {required && <span className="required">*</span>}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`form-textarea ${error ? 'form-input-error' : ''}`}
            required={required}
        />
        {error && <span className="form-error">{error}</span>}
    </div>
);

export const FormNumber = ({ label, name, value, onChange, min, max, step = 1, placeholder, error, required }) => (
    <div className="form-group">
        <label htmlFor={name} className="form-label">
            {label} {required && <span className="required">*</span>}
        </label>
        <input
            type="number"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className={`form-input ${error ? 'form-input-error' : ''}`}
            required={required}
        />
        {error && <span className="form-error">{error}</span>}
    </div>
);
