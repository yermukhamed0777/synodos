import { VISION_POINTS } from '@/lib/site';

export function Business() {
  return (
    <section className="section-block vision" id="vision">
      <div className="wrap vision-grid">
        <div>
          <span className="eyebrow eyebrow--purple">Vision</span>
          <h2 className="display" style={{ margin: '16px 0 26px' }}>
            Travel smarter.<br />Experience <span className="accent-red">deeper.</span>
          </h2>
          <div className="quote">
            <p>“The best journey isn’t the one with the most plans. It’s the one where you’re free to notice everything.”</p>
            <cite>Synodos — product principle</cite>
          </div>
        </div>
        <div className="vision-points">
          {VISION_POINTS.map((point, i) => (
            <div className="vision-point" key={point}>
              <b>0{i + 1}</b><span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
