export function FormAlert({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="rounded-xl border border-[#f0d9a8] bg-[#fff8ef] px-4 py-3 text-sm text-[#7c3e0a]"
    >
      {message}
    </p>
  );
}
