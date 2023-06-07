const define = ({ status, type, result }) => {
  const resultInError = result.slice(0, result.length - 2);
  const statusList = {
    fulfilled: `${type} ${result} successfully`,
    rejected: `Error ${resultInError}ing ${type}`,
  };
  return statusList[status];
};

const useResponse = ({ status, type, result }) => {
  const container = document.createElement('div');
  container.classList.add('status');
  container.classList.add(status);
  document.body.appendChild(container);
  container.textContent = define({ status, type, result });

  setTimeout(() => {
    container.remove();
  }, 3000);
};

export default useResponse;
