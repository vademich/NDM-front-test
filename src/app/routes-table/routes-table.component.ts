import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route } from '../route.model';

interface RouteTableItem {
    destination: string;
    gateway: string;
    interface: string;
}

@Component({
    selector: 'app-routes-table',
    templateUrl: './routes-table.component.html',
    styleUrls: ['./routes-table.component.css']
})
export class RoutesTableComponent implements OnInit {
    private routes: Route[] = [
        { uuid: '1', address: '0.0.0.0', mask: '0', gateway: '193.0.174.1', interface: 'Подключение Ethernet' },
        { uuid: '2', address: '10.1.30.0', mask: '24', gateway: '0.0.0.0', interface: 'Гостовая сеть' },
        { uuid: '3', address: '192.168.1.0', mask: '24', gateway: '0.0.0.0', interface: 'Домашняя сеть' },
        { uuid: '4', address: '193.0.174.0', mask: '24', gateway: '0.0.0.0', interface: 'Подключение Ethernet' },
        { uuid: '5', address: '193.0.175.0', mask: '25', gateway: '193.0.174.10', interface: 'Подключение Ethernet' },
        { uuid: '6', address: '193.0.175.22', mask: '32', gateway: '193.0.174.1', interface: 'Подключение Ethernet' },
        { uuid: '7', address: '172.16.0.0', mask: '16', gateway: '0.0.0.0', interface: 'Рабочая сеть' },
        { uuid: '8', address: '10.0.0.0', mask: '8', gateway: '10.0.0.1', interface: 'Офисная сеть' }
    ];

    private sortSubject = new BehaviorSubject<{ column: string, direction: 'asc' | 'desc' }>({ column: '', direction: 'asc' });

    displayedRoutes$ = this.sortSubject.pipe(
        map(sort => {
            const sortedRoutes = [...this.routes].map(route => ({
                destination: `${route.address}/${route.mask}`,
                gateway: route.gateway,
                interface: route.interface
            }));

            if (sort.column) {
                sortedRoutes.sort((a, b) => {
                    let compareResult = 0;

                    switch (sort.column) {
                        case 'destination':
                            compareResult = this.compareIpWithMask(a.destination, b.destination);
                            break;
                        case 'gateway':
                            compareResult = this.compareIps(a.gateway, b.gateway);
                            break;
                        case 'interface':
                            compareResult = a.interface.localeCompare(b.interface);
                            break;
                    }

                    return sort.direction === 'asc' ? compareResult : -compareResult;
                });
            }

            return sortedRoutes;
        })
    );

    ngOnInit(): void {
        // Инициализация
    }

    sort(column: string): void {
        const currentSort = this.sortSubject.value;

        if (currentSort.column === column) {
            // Изменяем направление сортировки для той же колонки
            this.sortSubject.next({
                column,
                direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
            });
        } else {
            // Сортируем по новой колонке (по возрастанию)
            this.sortSubject.next({
                column,
                direction: 'asc'
            });
        }
    }

    private compareIps(ipA: string, ipB: string): number {
        const numA = this.ipToNumber(ipA);
        const numB = this.ipToNumber(ipB);

        if (numA > numB) return 1;
        if (numA < numB) return -1;
        return 0;
    }

    private compareIpWithMask(ipMaskA: string, ipMaskB: string): number {
        const [ipA, maskA] = ipMaskA.split('/');
        const [ipB, maskB] = ipMaskB.split('/');

        const ipCompare = this.compareIps(ipA, ipB);
        if (ipCompare !== 0) return ipCompare;

        // Если IP одинаковые, сравниваем по маске
        const maskNumA = parseInt(maskA, 10);
        const maskNumB = parseInt(maskB, 10);

        if (maskNumA > maskNumB) return 1;
        if (maskNumA < maskNumB) return -1;
        return 0;
    }

    private ipToNumber(ip: string): number {
        if (ip === '0.0.0.0') return 0;

        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    }
}