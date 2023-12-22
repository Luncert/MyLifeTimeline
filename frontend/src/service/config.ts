
export default (import.meta.env.DEV ? {
  backend: {
    endpoint: "http://localhost:8080"
  }
} : {
  backend: {
    endpoint: ""
  }
});