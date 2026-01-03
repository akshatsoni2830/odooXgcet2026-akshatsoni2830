const Card = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || action) && (
        <div className="p-6 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0 ml-4">{action}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;