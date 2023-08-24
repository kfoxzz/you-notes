import styles from '../styles/Header.module.css'

export default function ExtensionHeader() {
  return (
    <div>
      <div className={styles.logo_text}>
        <img src="/icons/notes-32.png" alt="YouNotes Logo" width={32} height={32} />
        <h1>YouNotes</h1>
      </div>
      <p>
        Save time for what matters.
      </p>
    </div>
  )
}