import Login from './views/login.vue'
import Home from './views/home.vue'
import Table from './views/nav1/table.vue'
import Examine from './views/nav1/examine.vue'
import Order from './views/nav1/order.vue'
import UserAll from './views/nav1/userAll.vue'
import Record from './views/nav1/record.vue'


let routes = [
    {
        path: '/',
        component: Login,
        name: 'login',
    },
    {
        path: '/home',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/table', component: Table, name: 'Table' },
            { path: '/examine', component: Examine, name: 'Examine' },
            { path: '/order', component: Order, name: 'Order' },
            { path: '/userAll', component: UserAll, name: 'UserAll' },
            { path: '/record', component: Record, name: 'record' },
        ]
    }
];

export default routes;