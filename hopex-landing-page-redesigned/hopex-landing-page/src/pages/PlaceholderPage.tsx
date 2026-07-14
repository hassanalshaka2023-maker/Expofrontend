import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PlaceholderPage({ eyebrow, title, description }: PlaceholderPageProps) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-orb placeholder-orb-one" />
      <div className="placeholder-orb placeholder-orb-two" />
      <div className="placeholder-card">
        <img src="/assets/hopex-logo.png" alt="HOPEX" className="placeholder-logo" />
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="button button-primary" to="/">
          <ArrowLeft size={18} /> Back to home
        </Link>
      </div>
    </main>
  );
}
