export const useLocation = () => {

  function go(path: string) {
    window.location.href = path;
  }

  return {
    go
  }
}