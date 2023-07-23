'use client';
import { useState, useEffect } from 'react';
import styles from './game.module.css';
import Header from "@/app/header";
import axios from "axios"
import * as Sentry from "@sentry/nextjs";

const GOALS = [
    'Visit the Grave of Steve Jobs',
    'Win Arick in the Game of Chi',
    'Build Sauna on the Sun',
    'Seduce and have sex with the daughter of Bohdan Khmelnytsky',
    'Write the best congratulation for a Maks Birthday.'
]

let originalConsoleLog = console.log;

console.log = function(message) {
    originalConsoleLog.apply(console, arguments); // keep the original console.log behavior
    Sentry.captureMessage(message, 'info'); // send message to Sentry
};

function LoadingIndicator() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 500); // Change dots every 500ms

        return () => {
            clearInterval(interval);
        };
    }, []);

    return <div>.{'.'.repeat(dots)}</div>;
}
export default function Game() {

    const initialLives = typeof window !== "undefined" ? (localStorage.getItem('lives') ? Number(localStorage.getItem('lives')) : 24) : 24;
    const initialGoalIndex = typeof window !== "undefined" ? (localStorage.getItem('goalIndex') ? Number(localStorage.getItem('goalIndex')) : 0) : 0;
    const initialCharacterCount = typeof window !== "undefined" ?  (localStorage.getItem('characterCount') ? Number(localStorage.getItem('characterCount')) : 0) : 0;

    const [prompt, setPrompt] = useState("");
    const [action, setAction] = useState("");
    const [goalIndex, setGoalIndex] = useState(initialGoalIndex);
    const [success, setSuccess] = useState(null);
    const [explanation, setExplanation] = useState(null);
    const [lives, setLives] = useState(initialLives);
    const [isLoading, setIsLoading] = useState(false);
    const [isRulesVisible, setIsRulesVisible] = useState(true);
    const [isEndOfGame, setEndOfGame] = useState(false);
    const [isWinOfGame, setWinOfGame] = useState(false);
    const [characterCount, setCharacterCount] = useState(initialCharacterCount);

    useEffect(() => {
        localStorage.setItem('lives', lives);
        localStorage.setItem('goalIndex', goalIndex);
        localStorage.setItem('characterCount', characterCount);
    }, [lives, goalIndex, characterCount]);

    useEffect(() => {
        if (lives <= 0 || lives > 24) {
            setEndOfGame(true);
        }
    }, [lives]);

    function handleInputChange(e) {
        setPrompt(e.target.value);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setAction(prompt);
            setIsRulesVisible(false);
            setSuccess(null);
            setExplanation(null);
            handleSubmit();
        }
    }

    function handleSubmit() {
        console.log(`[INFO] User action submitted: ${prompt}`);
        console.log(`[INFO] Goal Index: ${goalIndex}`);
        console.log(`[INFO] Chars count: ${characterCount}`);
        console.log(`[INFO] Lives count: ${lives}`);

        setIsLoading(true);
        axios.post('/api/process-input', { userInput: prompt, goalIndex })
            .then((response) => {
                const { success, explanation } = response.data;
                console.log(`[INFO] Response from server: Success: ${success}, Explanation: ${explanation}`);

                setSuccess(success);
                setExplanation(explanation);

                if (success) {
                } else {
                    setLives(prevLives => prevLives - 1);
                }
            })
            .catch((error) => {
                console.error('[ERROR] Something went wrong.', error);
            })
            .finally(() => {
                setIsLoading(false);
                setPrompt("");
            });
    }

    function onNext() {
        console.log(`[INFO] User clicked next.`);
        setCharacterCount(characterCount + action.length);
        if (goalIndex !== GOALS.length - 1) {
            setGoalIndex(goalIndex + 1);
            console.log(`[INFO] Next goal: ${GOALS[goalIndex+1]}`);
            console.log(`[INFO] Chars count: ${characterCount}`);
        } else {
            setWinOfGame(true);
            console.log(`[INFO] User won a game with: ${GOALS[goalIndex+1]}`);
            console.log(`[INFO] Chars count: ${characterCount}`);
        }
        setAction("");
        setSuccess(null);
        setExplanation(null);
    }

    function handleToggleRules() {
        setIsRulesVisible(!isRulesVisible);
    }

    if (isEndOfGame) {
        return (
            <main className={styles.main}>
                <div className={styles.middle}>
                    <h2>
                        <span className={styles.red}> FUUUUUUUUUUUUU! You are dead. </span>
                    </h2>
                    <div> Hint: use your programming skills to reset the game and start again. But you already has one death! </div>
                </div>
            </main>
        )
    }

    if (isWinOfGame) {
        return (
            <main className={styles.main}>
                <div className={styles.middle}>
                    <h2>
                        <span className={styles.green}> No way... You did it! Arick is already investigating...</span>
                    </h2>
                    <div> You did it in {characterCount} chars. You lost {24 - lives} lives. </div>
                    <div> You Prize is: 10000$ / {characterCount} / Lives Used = {10000 / characterCount / (24 - lives)} $  Wow! </div>
                    <div> But we will deduce the payment for server, AI and moral damage!</div>
                    <div>  Contact our support to learn more... ❤️ </div>
                    <div> Arick is ... who? =D </div>
                </div>
            </main>
        )
    }
    return (
        <main className={styles.main}>
            <Header/>
            <div className={styles.lives}> <span className={styles.red}> ♥ </span> x {lives}</div>
            <div className={styles.lives}> <span>Aa </span> x {characterCount}</div>
            <div className={styles.middle}>
                <div onClick={handleToggleRules} className={styles.ruleHeader}>
                    Rules {isRulesVisible ? '▼' : '▲'}
                </div>
                {isRulesVisible &&
                    <div className={styles.rules}>
                        This is a game in which Maks has to compete with his own Goals in an arena controlled by LLM to determine who is the best.
                        <br/>
                        You control a Maks actions and can help yourself win by typing anything you think can help or needed to achieve the goal.
                        <br/>
                        The goal is to win using as few characters as possible.
                        Base prize stack is 10000$!
                        <br/>
                        Failed attempt cost one life.
                        <br/>
                        In later levels, there are tougher Goals and better defense.
                        <br/>
                        At the end You will recieve your congratulations. If you prove you worth it.
                    </div>
                }

                <div className={styles.main_actions}>
                    <h2 className={styles.task_title}>
                        Your goal is to <span className={styles.yellow}> {GOALS[goalIndex]} </span>
                        <br/>
                        {(explanation || isLoading) && <div>
                            Your action: &nbsp;
                            <span className={styles.yellow}>
                             {action}
                            </span>
                        </div>
                        }
                        {isLoading && <LoadingIndicator /> }
                        {!!explanation && <div>
                            Verdict: {success ? <span className={styles.green}>Success</span> : <span className={styles.red}>Failure</span>}
                        </div>}
                    </h2>

                    {explanation &&
                    <div>
                        IAricktman: {explanation}
                    </div>
                    }

                    {success &&
                        <div>
                            <span onClick={onNext} className={styles.next}>Next GOAL! →</span>
                        </div>
                    }
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.text_container}>
                    <div className={styles.text_before}> &gt; </div>
                    <textarea className={styles.input_answer} type="text" disabled={isLoading || success} value={prompt} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="I will JUST DO IT!" />
                </div>
            </div>
        </main>
    )
}