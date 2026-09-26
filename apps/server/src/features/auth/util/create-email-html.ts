export function createEmailHTML({ title, bodyText }: { title: string; bodyText: string }) {
  return `
      <html>
        <h1>${title}</h1>
        <p>
          ${bodyText}
        </p>
        <i>With friendly regards, the e-MRK team.</i>
      </html>
    `;
}
