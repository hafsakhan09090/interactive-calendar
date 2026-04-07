import styles from '@/styles/Calendar.module.css'

export default function HeroImage() {
  return (
    <div className={styles.heroImage}>
      <img 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format" 
        alt="Serene mountain lake with vintage tones"
        style={{ objectPosition: 'center 30%' }}
      />
    </div>
  )
}
