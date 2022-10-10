## Instructions

Requirements: Docker, Node.js, Python (tested w/3.10)

To get going run these commands:

```sh
npm install
npm run db:up
npm run dbmate migrate

# start the server
npm run server

# start the client (in another tab)
npm run dev
```

Open up 2 browsers side by side: [http://localhost:5173](http://localhost:5173):

 * Add a note
 * Move a note
 * Watch the changes in the other browser
 * (TODO) Edit a note

### Cleanup
To remove the postgres docker container afterwards
```
npm run db:kill
```

## Client

JS: React with Tailwind (DaisyUI)

## Server

Python: FastAPI, GraphQL (Strawberry) with Subscriptions

## TODOs
- add z-index
- positioning bug
  - deleting lower id card, shifts the rest of the cards relatively upwards
- add card input
  - enter adds
  - no border around it
- edit card title and text
  - markdown editor
- update fields selectively - make them optional in the upsert operation
- heretext links between notes
- verify state is consistent when client disconnects