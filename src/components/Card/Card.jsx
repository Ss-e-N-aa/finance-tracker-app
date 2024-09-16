import styles from './Card.module.css';

export default function Card() {
    return (
        <div className={styles.card}>
            <h4>Card info</h4>
            <p>Some details in the card ...</p>
        </div>
    )
}
