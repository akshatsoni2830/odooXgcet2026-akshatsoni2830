const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const getButtonClass = () => {
    let classes = 'btn';
    
    // Add variant class
    switch (variant) {
      case 'primary':
        classes += ' btn-primary';
        break;
      case 'secondary':
        classes += ' btn-secondary';
        break;
      case 'outline':
        classes += ' btn-outline';
        break;
      case 'danger':
        classes += ' btn-primary'; // Using primary style for now
        break;
      case 'ghost':
        classes += ' btn-outline';
        break;
      default:
        classes += ' btn-primary';
    }
    
    // Add size class
    switch (size) {
      case 'sm':
        classes += ' btn-sm';
        break;
      case 'md':
        classes += ' btn-md';
        break;
      case 'lg':
        classes += ' btn-lg';
        break;
      default:
        classes += ' btn-md';
    }
    
    return `${classes} ${className}`;
  };

  return (
    <button
      className={getButtonClass()}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin mr-2" style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;