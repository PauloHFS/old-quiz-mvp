import React from 'react';

const formatarData = new Intl.DateTimeFormat(['pt-BR'], {
  dateStyle: 'full',
});

const formatarTempoPassado = (data: string) => {
  const dataPassada = new Date(data);
  const dataAtual = new Date();

  const diferencaEmSegundos = Math.floor(
    (dataAtual.getTime() - dataPassada.getTime()) / 1000
  );

  if (diferencaEmSegundos < 60) {
    return `há ${diferencaEmSegundos} segundo${
      diferencaEmSegundos !== 1 ? 's' : ''
    }`;
  }

  const diferencaEmMinutos = Math.floor(diferencaEmSegundos / 60);
  if (diferencaEmMinutos < 60) {
    return `há ${diferencaEmMinutos} minuto${
      diferencaEmMinutos !== 1 ? 's' : ''
    }`;
  }

  const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);
  if (diferencaEmHoras < 24) {
    return `há ${diferencaEmHoras} hora${diferencaEmHoras !== 1 ? 's' : ''}`;
  }

  return formatarData.format(dataPassada);
};

interface PassTimeProps {
  time: string;
}

// TODO improve the timeout to increase the performance
export const PassTime: React.FC<PassTimeProps> = ({ time }) => {
  const [tempoPassado, setTempoPassado] = React.useState(
    formatarTempoPassado(time)
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTempoPassado(formatarTempoPassado(time));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return <time dateTime={time}>{tempoPassado}</time>;
};
