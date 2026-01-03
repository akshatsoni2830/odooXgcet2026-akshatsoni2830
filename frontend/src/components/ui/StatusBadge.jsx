const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusClass = () => {
    const baseClass = 'status-badge';
    
    switch (type) {
      case 'leave':
        switch (status?.toLowerCase()) {
          case 'approved':
            return `${baseClass} status-approved`;
          case 'pending':
            return `${baseClass} status-pending`;
          case 'rejected':
            return `${baseClass} status-rejected`;
          default:
            return `${baseClass}`;
        }
      case 'attendance':
        switch (status?.toLowerCase()) {
          case 'present':
            return `${baseClass} status-present`;
          case 'absent':
            return `${baseClass} status-absent`;
          case 'half-day':
            return `${baseClass} status-half-day`;
          case 'leave':
            return `${baseClass} status-leave`;
          default:
            return `${baseClass}`;
        }
      default:
        return `${baseClass}`;
    }
  };

  return (
    <span className={getStatusClass()}>
      {status}
    </span>
  );
};

export default StatusBadge;
