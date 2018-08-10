new Vue({
    el: '#app',
    data: {
        total: 0,
        results: [],
        items: [],
        cart: [],
        search: 'poster',
        isloading: false,
        lastSearch: ''
    },
    methods: {
        findInArray: function (array, index, property) {},
        appendItems: function () {
            if(this.items.length >4) 
            {
                let listLength = this.items.length;
                this.items.push(...this.results.slice(listLength, listLength+5));
            }
        },
        onSubmit: function (event) {
            this.items = [];
            this.results =[];
            this.isloading = true;
            this
                .$http
                .get('/search/'.concat(this.search))
                .then(function (res) {
                    this.lastSearch = this.search;
                    this.isloading = false;
                    res
                        .data
                        .forEach((x) => {
                            let data = {
                                title: x.title,
                                id: x.id,
                                description: x.description,
                                link: x.link,
                                price: Math.floor((Math.random() * 10) + 1)
                            }
                            this
                                .results
                                .push(data)
                        })
                    this.items = this
                        .results
                        .slice(0, 5)
                });

        },
        addToCart: function (index) {
            this.total += this.items[index].price;
            let flag = true;
            this
                .cart
                .forEach((x) => {
                    if (x.title == this.items[index].title) {
                        x.qty++;
                        flag = false;
                    }
                });
            if (flag) {
                let cartItem = {
                    title: this.items[index].title,
                    price: this.items[index].price,
                    qty: 1,
                    id: index
                }
                this
                    .cart
                    .push(cartItem)
            }
        },
        changeQuantity: function (item, index, e) {
            this
                .cart
                .forEach((x, i) => {
                    if (x.id == item.id) {
                        if (e === 'add') {
                            x.qty++;
                        } else {
                            x.qty--;
                            if (x.qty === 0) {
                                this
                                    .cart
                                    .splice(i, 1)
                            }
                        }

                    }
                });

        }
    },
    filters: {
        currency: function (price) {
            return '$' + price.toFixed(2);
        }
    },
    mounted: function () {
        let instance =this;
        let elem = document.getElementById('product-list-bottom')
        let watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function () {
            instance.appendItems();
        })
        this.onSubmit();
    }
});
