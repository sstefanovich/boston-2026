interface AddressBlockProps {
  address?: string;
  className?: string;
}

export function AddressBlock({ address, className = '' }: AddressBlockProps) {
  if (!address) return null;
  return <p className={`address-line ${className}`.trim()}>📍 {address}</p>;
}
