/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import styles from './NewPost.module.sass'

// lib
import moment from 'moment/moment'

// hooks
import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch'

// react router dom
import { Link, useNavigate } from 'react-router-dom'

// Icons
import { IoMdArrowRoundBack } from 'react-icons/io'

// Components
import Header from '../../components/header'

// Firebase
import { getAuth } from "firebase/auth";

// Supabase
import { useAuthentication } from '../../supabase/useAuth';

// Backend
import backend from '../../axios/config'

export default function NewPost() {

    const navigate = useNavigate()
    const [titulo, setTitulo] = useState('')
    const dataPostagem = moment().format('L')
    const [tag, setTags] = useState([])
    const [descricao, setDescricao] = useState('')
    const [sessionId, setSessionId] = useState()

    const url = 'http://localhost:7154/newpost'
    const { httpConfig, loading } = useFetch(url)

    // Nome de usuário
    const auth = useAuthentication();
    const user = getUser().then(result => setSessionId(result));
    const displayName = auth.getEmail();

    let actualDisplayName;

    displayName.then(function(result){
        actualDisplayName = result;
    })

    async function getUser()
    {
        const user = await auth.getUserId();
        
        return user
    }

    //Validação 
    const [erroTitulo, setErroTitulo] = useState('');
    const [erroTag, setErroTag] = useState('');
    const [erroDescricao, setErroDescricao] = useState('');
    const [erroPrimeiroItem, setErroPrimeiroItem] = useState('');

    // Listagem de fato
    const [lista, setLista] = useState([
        {
            nome_item: '',
            descricao_item: ''
        }
    ]);

    const handleSoma = () => {
        let novoItem = { nome_item: '', descricao_item: 'TESTEadição' }
        setLista([...lista, novoItem])
    }

    const handleRemove = () => {
        if (lista.length > 2) {
            let novaLista = lista.slice(0, -1)
            setLista(novaLista)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Validações
        if (!titulo) {
            setErroTitulo("Insira um título para a lista")
        } else {
            setErroTitulo('');
        }

        if (!tag) {
            setErroTag("Insira pelo menos uma tag")
        } else {
            setErroTag('');
        }

        if (!descricao) {
            setErroDescricao("Insira uma descrição")
        } else {
            setErroDescricao('');
        }

        if (!lista[0].nome_item || !lista[0].descricao_item) {
            setErroPrimeiroItem('Preencha o primeiro item com título e descrição')
        }


        // ID
        //const idPost = Math.floor(Math.random() * 1000)

        // const post = {
        //     titulo,
        //     dataCriacao: dataPostagem,
        //     tags: tag,
        //     descricao,
        //     conteudo: lista,
        //     numLikes: 0,
        //     idUsuario: actualUser
        // }

        if (erroTitulo || erroTag || erroDescricao || erroPrimeiroItem) {
            return;
        }

        try {
            await backend.post(`/newpost`,{
                titulo,
                conteudo: lista,
                numLikes: 0,
                idUsuario: sessionId,
                tags: tag,
                descricao
            });
            //await httpConfig(post, "POST")
            navigate('/');
        } catch (error) {
            console.log(error)
        }
        // Redirecionar
    }
    return (
        <>
            <Header />
            <div className={styles.section}>
                <div className={styles.post}>
                    <div className={styles.header}>
                        <Link to={'/'}> <IoMdArrowRoundBack className={styles.icon} /></Link>
                        <h1>Nova lista</h1>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.uperForm}>
                            <label className={styles.title}>
                                Título da Lista
                                <input
                                    required
                                    value={titulo} type="text" onChange={(e) => setTitulo(e.target.value)} />
                                {erroTitulo && <p className={styles.email_error}>{erroTitulo}</p>}

                            </label>

                            <label className={styles.tags}>
                                Tags
                                <input
                                    required
                                    // PS: Isto está horrivelmente maravilhosamente funcionando, é oque importa!
                                    onChange={(e) =>
                                        setTags(
                                            ((e.target.value).split(",").map((tag) => tag.trim()))
                                                .filter((tag) => tag !== "")
                                        )
                                    }
                                />
                            </label>

                            <label className={styles.descricao}>
                                Descrição
                                <textarea required value={descricao} className={styles.text} type="text" onChange={(e) => setDescricao(e.target.value)} ></textarea>
                            </label>
                            <a onClick={handleSoma} className={styles.addRem}>Adicionar item</a>
                            <a onClick={handleRemove} className={styles.addRem}>Remover item</a>
                        </div>
                        <div className={styles.itens}>
                            {lista.map((item, index) => (
                                <div className={styles.item_lista} key={index}>
                                    <label className={styles.item_tit}>
                                        Título {index + 1}
                                        <input
                                            required
                                            type="text"
                                            className={styles.item_input}
                                            onChange={(e) => {
                                                const newList = [...lista];
                                                newList[index].nome_item = e.target.value;
                                                setLista(newList);
                                            }}
                                        />
                                    </label>
                                    <label className={styles.descricao}>
                                        Descrição
                                        <textarea
                                            required
                                            type="text"
                                            className={styles.item_text}
                                            onChange={(e) => {
                                                const newList = [...lista];
                                                newList[index].descricao_item = e.target.value;
                                                setLista(newList);
                                            }}
                                        ></textarea>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className={styles.botoes}>
                                {loading ? <p>Aguarde!</p>
                                    : <input className={styles.submit} type="submit" value="Criar Lista" />}
                            </div>
                            {/* Anexar imagem no futuro... */}
                        </div>

                    </form>

                </div>

            </div>
        </>
    )
}
