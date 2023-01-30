export class Video{
    //encapsulamento (PRIVATE, PUBLIC)
    constructor(
        private id: string,
        private title: string,
        private duration: string,
        private uploadAt: string
        ){}

        /* getId - método para pegar a id do objeto */
        public getId():string {
            return this.id
        }

        /* setId - método publico seguro para alterar id do objeto */
        public setId(value:string):void {
            this.id = value
        }

        public getTitle(): string {
            return this.title
        }
        public setTitle(value: string) {
            this.title = value
        }
        public getDuration(): string {
            return this.duration
        }
        public setDuration(value: string) {
            this.duration = value
        }
        public getUploadAt(): string {
            return this.uploadAt
        }
        public setUploadAt(value: string) {
            this.uploadAt = value
        }
    }
        
const video = new Video(
    "v003",
    "Deftones",
    "03:45",
    "2023-01-30 10:02:00"
)


console.table(video);
// video.setId("v004");
// console.table(video);
