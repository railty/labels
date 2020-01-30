<script>
    export let appName;
</script>


<nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
            data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
            <a class="navbar-item">
                {appName}
            </a>

            <a class="navbar-item">
                Documentation
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    Zoom
                </a>
                <div class="navbar-dropdown">
                    <a class="navbar-item">200%</a>
                    <a class="navbar-item">100%</a>
                    <a class="navbar-item">50%</a>
                    <hr class="navbar-divider">
                    <a class="navbar-item">
                        Report an issue
                    </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    Insert
                </a>
                <div class="navbar-dropdown">
                    <div class="nested navbar-item dropdown">
                        <div class="dropdown-trigger">
                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                <span>Dropdown button</span>
                                <span class="icon is-small">
                                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                                </span>
                            </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item">
                                    Dropdown item
                                </a>
                                <a class="dropdown-item">
                                    Other dropdown item
                                </a>
                                <a href="#" class="dropdown-item is-active">
                                    Active dropdown item
                                </a>
                                <a href="#" class="dropdown-item">
                                    Other dropdown item
                                </a>
                                <hr class="dropdown-divider">
                                <div class="nested dropdown dropdown-item">
                                    <div class="dropdown-trigger">
                                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                                            <span>Dropdown button</span>
                                            <span class="icon is-small">
                                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                        </button>
                                    </div>
                                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div class="dropdown-content">
                                            <a href="#" class="dropdown-item">
                                                Dropdown item
                                            </a>
                                            <a class="dropdown-item">
                                                Other dropdown item
                                            </a>
                                            <a href="#" class="dropdown-item is-active">
                                                Active dropdown item
                                            </a>
                                            <a href="#" class="dropdown-item">
                                                Other dropdown item
                                            </a>
                                            <hr class="dropdown-divider">
                                            <a href="#" class="dropdown-item">
                                                With a divider
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a class="navbar-item">
                        Jobs
                    </a>
                    <a class="navbar-item">
                        Contact
                    </a>
                    <hr class="navbar-divider">
                    <a class="navbar-item">
                        Report an issue
                    </a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </div>
        </div>
    </div>
</nav>