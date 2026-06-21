export function calcularMetricas(monitor) {
    const totalChecks = monitor.checks.length;
    const successfulChecks = monitor.checks.filter(check => check.status >= 200 && check.status < 400);
    const cantidadExitosa = successfulChecks.length;
    const lastCheck = monitor.checks.length > 0 ? monitor.checks[monitor.checks.length - 1] : null;
    const uptimePercentage = totalChecks > 0 ? (cantidadExitosa / totalChecks) * 100 : 0;
    const averageResponseTime = cantidadExitosa > 0 ? successfulChecks.reduce((acc, check) => acc + check.responseTime, 0) / cantidadExitosa : 0;
    return {
        url: monitor.url,
        lastStatus: lastCheck ? lastCheck.status : "N/A",
        lastResponseTime: lastCheck ? lastCheck.responseTime : "N/A",
        totalChecks,
        successfulChecks: cantidadExitosa,
        uptimePercentage,
        averageResponseTime
    };
}


