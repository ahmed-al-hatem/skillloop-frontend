import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import type { Match } from '../schemas/match.schema';

export type PartnerCardProps = { match: Match };

export function PartnerCard({ match }: PartnerCardProps) {
  const { partner, theyOffer, theyWant, score } = match;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {partner.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{partner.name}</p>
          {partner.rating !== null && (
            <p className="text-sm text-muted-foreground">★ {partner.rating.toFixed(1)}</p>
          )}
        </div>
        <Badge>{score}%</Badge>
      </div>

      <SkillRow label="يعلّمك" skills={theyOffer.map((s) => s.name)} />
      <SkillRow label="يتعلّم منك" skills={theyWant.map((s) => s.name)} variant="secondary" />

      <Button variant="outline" className="mt-auto">
        اقترح تبادلاً
      </Button>
    </Card>
  );
}

function SkillRow({
  label,
  skills,
  variant = 'default',
}: {
  label: string;
  skills: string[];
  variant?: 'default' | 'secondary';
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      {skills.map((name) => (
        <Badge key={name} variant={variant}>
          {name}
        </Badge>
      ))}
    </div>
  );
}
