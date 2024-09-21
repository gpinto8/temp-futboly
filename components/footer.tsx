export const Footer = () => {
  const year = new Date().getFullYear();
  const name = 'Futboly';

  return (
    <div className="flex flex-wrap justify-center w-full py-4 text-center">
      <span>
        Copyright © {year} {name}.
      </span>
      <span>&nbsp;All Rights Reserved.</span>
    </div>
  );
};
