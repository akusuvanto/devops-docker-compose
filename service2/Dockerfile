FROM golang:1.23

RUN mkdir /app
WORKDIR /app

COPY go.mod ./

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /go-status-server

CMD ["/go-status-server"]
