import GoalsCard from '../components/GoalsCard/GoalsCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSavingsGoals } from '../store/savingsGoals-slice';
import { fetchTransactions } from '../store/transactions-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import Card from '../components/Card/Card';
import '../styles/SavingsGoals.css'

export default function SavingsGoals() {
    const dispatch = useDispatch();
    const [user] = useAuthState(auth);
    const { savingsGoals, goalsTotal, progressTotal } = useSelector((state) => state.savingsGoals);
    const { totalBalance } = useSelector((state) => state.transactions);

    useEffect(() => {
        if (user) {
            dispatch(fetchTransactions(user.uid));
            dispatch(fetchAllSavingsGoals(user.uid));
        }
    }, [user, dispatch]);

    return (
        <>
            <section className='goalsSection'>
                <ul className='cardList'>
                    <li><Card title="Current Balance" amount={totalBalance} isFirst={true} /></li>
                </ul>
            </section>

            <section className='goalsSection'>
                <ul className='cardList'>
                    <li id='totalCard'>
                        <GoalsCard title="Total Goals" progressAmount={progressTotal} targetAmount={goalsTotal} isFirst={true} addBtn modalType="goal" />
                    </li>
                </ul>
            </section>

            <section className='goalsSection'>
                <ul className='cardList'>
                    {savingsGoals.map((i) => (
                        <li key={i.id}>
                            <GoalsCard
                                id={i.id}
                                title={i.name}
                                amount={i.amount}
                                progressAmount={i.progressAmount}
                                targetAmount={i.targetAmount}
                                AddUpdateBtn
                                modalType="updateGoal"
                            />
                        </li>
                    ))
                    }
                </ul>
            </section>
        </>
    )
}
