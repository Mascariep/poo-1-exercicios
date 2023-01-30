import express, { Request, Response } from 'express'
import cors from 'cors'
import { TVideoDB } from './types'
import { db } from './database/knex'
import { Video } from './models/Video'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
});

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q // pesquisa

        let videosDB //declarei a variavel

        if (q) {
            const result: TVideoDB[] = await db("videos").where("name", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: TVideoDB[] = await db("videos")
            videosDB = result
        }

        const videos: Video[] = videosDB.map((videoDB)=>
            new Video(
                videoDB.id,
                videoDB.title,
                videoDB.duration,
                videoDB.upload_at
            )
        )

        res.status(200).send(videos)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "string") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }

        const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id })

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Video ( 
            id,
            title,
            duration,
            new Date().toISOString()
            ) 
        
        const newVideoDB: TVideoDB ={

            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getUploadAt()
        }

        await db("videos").insert(newVideoDB)
        const response = {
            message: "Video adicionando com sucesso!",
            newVideo
        }
        //const [ videoDB ]: TVideoDB[] = await db("videos").where({ id })

        res.status(201).send(response)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newTitle = req.body.title
        const newDuration = req.body.duration

        if (typeof idToEdit !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof newTitle !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof newDuration !== "string") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }
        const [videos] = await db("videos").where({id: idToEdit})

        const newVideo = new Video (
            newId,
            newTitle,
            newDuration,
            new Date().toISOString()
        )

        const newVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getUploadAt()
        }

        if (videos){
            const updateVideo = {
                id: newVideoDB.id || videos.id,
                title: newVideoDB.title || videos.title,
                duration: newVideoDB.duration || videos.duration,
                upload_at: newVideo.getUploadAt() || videos.upload_at
            }
            await db("videos")
            .update(updateVideo)
            .where({id: idToEdit})
        }else{
            res.status(404)
            throw new Error("ID inválido, tente novamente!")
        }
        res.status(201).send("Vídeo alterado com sucesso!")

} catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
}
});

app.delete("/videos/:id", async (req: Request, res: Response) =>{
    try {
        const idToDelete = req.params.id

        if (typeof idToDelete !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        const [ videoExists ] = await db("videos").where({ id: idToDelete })

        if (videoExists) {
                await db("videos")
                .del()
                .where({ id: idToDelete })
        } else {
            res.status(404)
            throw new Error("Id inválido, tente novamente!")
        }

        res.status(201).send("Video deletado com successo")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});