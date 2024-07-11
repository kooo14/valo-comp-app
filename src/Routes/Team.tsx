import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

import ErrorModal from '../Components/ErrorModal';
import PlayerCard from '../Components/PlayerCard';

import { useFetchData } from '../Hooks/useFetchData';
import { useSendData } from '../Hooks/useSendData';


function App() {
    const [formState, setFormState] = useState({
        map_name: 'スプリット',
        proficiency: ['good'], // チェックされている熟練度が入る. 例: ['good', 'bad']
        minimum_priority: 5,
        members: ['', '', '', '', ''],
        password: ""
    });

    const [isCriticalError, setCriticalError] = useState(false);
    const [isNormalError, setNormalError] = useState(false);

    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const [name, setName] = useState(query.get('server') || "");
    const { responseData, reFetch, setReFetch } = useFetchData(`alldata?server_name=${name}`, setCriticalError, setErrorMessage);
    const { responseData: responseData2, reFetch: reFetch2, setReFetch: setReFetch2 } = useSendData("team", formState, setNormalError, setErrorMessage);


    React.useEffect(() => {
        const query_name = query.get('server');
        if (query_name !== null) {
            setName(query_name);
        }
    }
        , [query]);


    React.useEffect(() => {
        if (name !== "") {
            setReFetch(true);
        } else {
            setCriticalError(true);
            setErrorMessage("サーバー名が指定されていません。配布されたURLよりアクセスしてください。");
        }
    }, [name]); // nameが変更されたときにのみこのエフェクトを実行

    const handleCompButton = (e: React.FormEvent) => {
        e.preventDefault();

        // プレイヤーが選択されていない場合
        if (formState.members.includes("")) {
            setNormalError(true);
            setErrorMessage("プレイヤーが選択されていません。");
            return;
        }

        // プレイヤーが重複している場合
        if (new Set(formState.members).size !== formState.members.length) {
            setNormalError(true);
            setErrorMessage("プレイヤーが重複しています。");
            return;
        }

        // 熟練度が1つも選択されていない場合
        if (formState.proficiency.length === 0) {
            setNormalError(true);
            setErrorMessage("熟練度が選択されていません。1つ以上選択してください。");
            return;
        }

        // 最低優先度が0以下の場合
        if (formState.minimum_priority <= 0) {
            setNormalError(true);
            setErrorMessage("最低優先度が0以下です。1以上の値を入力してください。");
            return;
        }

        // パスワードにnameを追加
        setFormState(prevState => ({
            ...prevState,
            password: name
        }));

        setReFetch2(true);
    }




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            const newProficiency = formState.proficiency;
            if (checked) {
                newProficiency.push(id as never);
            } else {
                const index = newProficiency.indexOf(id as never);
                if (index > -1) {
                    newProficiency.splice(index, 1);
                }
            }
            setFormState(prevState => ({
                ...prevState,
                proficiency: newProficiency
            }));

        } else {
            if (id === "minimum_priority") {
                const intValue = parseInt(value);
                setFormState(prevState => ({
                    ...prevState,
                    [id]: intValue
                }));
            } else {
                setFormState(prevState => ({
                    ...prevState,
                    [id]: value
                }));
            }
        }

    };

    const handlePlayerChange = (index: number, value: string) => {
        setFormState(prevState => {
            const newPlayers = [...prevState.members];
            newPlayers[index] = value;
            return { ...prevState, members: newPlayers };
        });
    };

    useEffect(() => {
        if (responseData2 && responseData2.success) {
            // チーム編成成功時の処理
            // ページの一番下にスクロール
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
        , [responseData2])


    return (
        <>
            <Navbar expand="lg" style={{ backgroundColor: 'var(--secondary-color)' }} className="mb-2">
                <Container>
                    <Navbar.Brand style={{ color: 'var(--primary-color)' }}>VALORANT 自動編成ツール</Navbar.Brand>
                </Container>
            </Navbar>

            {/* サーバー名未指定エラー */}
            <ErrorModal show={isCriticalError} errorMessage={errorMessage} setShow={setCriticalError} showClose={false} />

            {/* その他の続行可能エラー */}
            <ErrorModal show={isNormalError} errorMessage={errorMessage} setShow={setNormalError} showClose={true} />


            <Container>
                <div className='mb-3'></div> {/* 余白用 */}
                <Card>
                    <Card.Body>
                        <Form onSubmit={handleCompButton}>
                            <Row className='mb-3'>
                                <Form.Group as={Col} controlId="map_name" className='m-3'>
                                    <Form.Label>マップ</Form.Label>
                                    <Form.Select
                                        aria-label="マップ選択"
                                        value={formState.map_name}
                                        onChange={handleInputChange}
                                    >
                                        {responseData && responseData.maps.map((map: string) => (
                                            <option key={map}>{map}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="proficiency" className='m-3'>
                                    <Form.Label>キャラの熟練度</Form.Label>
                                    <div key="checkbox">
                                        <Form.Check
                                            inline
                                            label="上手"
                                            id="good"
                                            type="checkbox"
                                            defaultChecked
                                            onChange={handleInputChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="普通"
                                            id="normal"
                                            type="checkbox"
                                            onChange={handleInputChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="下手"
                                            id="bad"
                                            type="checkbox"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group as={Col} controlId="minimum_priority" className='m-3'>
                                    <Form.Label>最低優先度</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="最低優先度"
                                        value={formState.minimum_priority}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className='mb-3'>
                                <Col sm={10}>
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <Form.Group as={Row} className='m-3 justify-content-md-center' controlId={`player_select_${i + 1}`} key={i}>
                                            <Form.Label column sm={3}>{`プレイヤー${i + 1}`}</Form.Label>
                                            <Col sm={9}>
                                                <Form.Select
                                                    aria-label={`プレイヤー${i + 1}選択`}
                                                    value={formState.members[i]}
                                                    onChange={e => handlePlayerChange(i, e.target.value)}
                                                >
                                                    <option value="">選択してください</option>
                                                    {responseData && responseData.members.map((member: string) => (
                                                        <option key={member}>{member}</option>
                                                    ))}
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>
                                    ))}
                                </Col>
                                <div className='text-end'>
                                    <Button variant="primary" type="submit">
                                        編成する
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
                {reFetch2 && "チーム編成中..."}

                {/* <hr /> */}
                <div className='mt-5'></div> {/* 余白用 */}
                {responseData2 && (
                    <>
                        {/* responseData2は以下のフォーマットである
                        {success: true, team: [["のなか", 1, "スカイ", 1], ["ともや", 1, "サイファー", 1], ["ぱーぼん", 1, "アストラ", 1], ["こーさん", 1, "セージ", 2], ["ぽめ", 1, "レイズ", 1]], priority: 6} */}
                        <h2 className='mb-3'>チーム編成結果</h2>
                        {responseData2.team.map((player: any) => (
                            <PlayerCard playerName={player[0]} proficiency={player[1]} agent={player[2]} priority={player[3]} key={player[0]} />
                        ))}
                    </>
                )}

                <div className='mb-5'></div> {/* 余白用 */}
            </Container>

        </>
    );
}

export default App;
